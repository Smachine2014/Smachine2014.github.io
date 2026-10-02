# Google API keys

The website uses a keyless Google Maps iframe and a site-local JSON reviews
feed. Neither needs a Google API key in this repository.

Before opening a pull request, run:

```sh
python3 scripts/check-google-api-keys.py --base origin/main
```

CI runs on pull requests and pushes to main. It checks every new commit's
tracked paths, files and commit message, including
intermediate commits where a key was added and then deleted. It reports file
paths and object IDs, never key values, and makes no Google API calls.

This check detects plaintext Google API keys; it is not a general secret scanner.
A failed check does not undo a push or remove existing Git history. Remove the
key from the proposed commits, restrict or revoke it with Google as appropriate,
and coordinate a history cleanup if it has already been published. Old clones,
forks and GitHub cached views can retain previously exposed credentials.
