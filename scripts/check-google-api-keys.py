#!/usr/bin/env python3
"""Check tracked snapshots for Google API keys without printing their values."""

import argparse
import re
import subprocess
import sys


KEY = re.compile(rb"AIza[0-9A-Za-z_-]{35}")


def git(*args):
    return subprocess.check_output(["git", *args])


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--base", help="Scan every new commit after this base too")
    args = parser.parse_args()
    commits = {git("rev-parse", "HEAD").strip()}
    if args.base:
        if set(args.base) == {"0"}:
            commits.update(git("rev-list", "HEAD").splitlines())
        else:
            base = git("rev-parse", "--verify", args.base + "^{commit}").strip()
            commits.update(git("rev-list", base.decode() + "..HEAD").splitlines())

    blobs = {}
    tracked_paths = set()
    for commit in sorted(commits):
        for entry in git("ls-tree", "-r", "-z", commit.decode()).split(b"\0"):
            if not entry:
                continue
            metadata, path = entry.split(b"\t", 1)
            _, kind, oid = metadata.split()
            tracked_paths.add(path)
            if kind == b"blob":
                blobs.setdefault(oid, set()).add(path)

    failures = 0
    for path in sorted(tracked_paths):
        if KEY.search(path):
            safe_path = KEY.sub(b"[REDACTED]", path).decode(errors="replace")
            print(f"Google API key detected in tracked path {safe_path!r}")
            failures += 1
    for oid, paths in sorted(blobs.items()):
        if KEY.search(git("cat-file", "blob", oid.decode())):
            path = min(paths)
            safe_path = KEY.sub(b"[REDACTED]", path).decode(errors="replace")
            print(f"Google API key detected in {safe_path!r} (blob {oid[:12].decode()})")
            failures += 1
    for commit in sorted(commits):
        if KEY.search(git("cat-file", "commit", commit.decode())):
            print(f"Google API key detected in commit {commit[:12].decode()}")
            failures += 1
    if failures:
        print("Remove keys before merging. Values were redacted; no API calls were made.")
        return 1
    print(f"No Google API keys found in {len(blobs)} blobs across {len(commits)} commits.")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except subprocess.CalledProcessError:
        print("Unable to inspect Git history; ensure the base exists in a full checkout.", file=sys.stderr)
        sys.exit(2)
