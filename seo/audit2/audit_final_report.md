# North Shore Judo — SEO & Business Audit

**URL:** northshorejudo.co.nz  
**Date:** 2026-04-09

## Executive Summary
North Shore Judo’s website presents a modern, visually engaging one‑page design that quickly conveys the club’s offering of judo classes for kids, teens and adults in Takapuna. It uses descriptive meta tags, canonical links and robust LocalBusiness and FAQ structured data to communicate essential information to search engines. The hero section, clear pricing and strong calls to action (“Get a free class,” “Sign up now”) make the value proposition obvious to visitors. However, the simplicity of the one‑page approach becomes a limitation: anchor links to `/about`, `/classes` and `/contact` return 404 errors, and there are no dedicated pages optimised for specific keywords. The site also lacks a blog, instructor bios, testimonials and social media integration.

Local SEO signals are partly in place—the contact section lists the club’s phone, email and address, and the structured data includes geo coordinates and an extensive `areaServed` list. Yet the contact details are not clickable, there is no embedded map, and the business uses a generic Gmail address. Off‑site citations are scarce; a single directory listing contains positive reviews, while the club is absent from many industry and local directories. Competitor judo clubs in Auckland provide detailed class schedules, instructor biographies, event calendars and active social media channels, giving them stronger content depth and local authority.

To compete effectively, North Shore Judo should expand its website architecture (creating dedicated pages for classes, coaches, pricing and contact), integrate on‑site registration and contact forms, claim and optimise its Google Business Profile, and develop a blog to publish ongoing content. Enhancing local citations, implementing clickable NAP, embedding a map, adding coach bios and testimonials, and establishing official social media channels will further improve visibility, trust and user engagement. A priority action plan lists the most impactful steps, beginning with fixing broken links and building out the site to attract more organic traffic and conversions.

## 1. Technical SEO
### Findings
* **Single‑page structure:** North Shore Judo uses a one‑page layout with anchor links for About, Classes, Team, FAQ and contact sections. There are no separate /about or /contact pages; attempting to visit these URLs returns a 404 error.
* **Meta tags:** The homepage has a well‑optimised `<title>` (“North Shore Judo | Judo Classes in Takapuna, Auckland NZ”) and a descriptive meta description summarising the club’s offering【737705830272375†L0-L3】【737705830272375†L6-L8】. Geo tags specify the region and coordinates, and Open Graph/Twitter Card tags are present【737705830272375†L11-L23】.
* **Canonical link:** A canonical tag points to the root URL【737705830272375†L9-L11】, ensuring search engines index the correct page.
* **Structured data:** JSON‑LD markup defines a LocalBusiness/SportsActivityLocation schema with address, phone, email, opening hours, offers for each class and membership in judo associations【737705830272375†L969-L1124】. Additional schemas include FAQPage, WebSite and BreadcrumbList【737705830272375†L1154-L1221】.
* **Robots & sitemap:** `robots.txt` allows all standard user agents and specifically welcomes AI search bots while disallowing AI training bots; it links to a sitemap【106518220297314†L0-L32】. The sitemap lists only the homepage with a recent last‑modified date (March 2026)【48459395756726†screenshot】.
* **Heading hierarchy:** The page appears to have a single H1 (the hero tagline) followed by logical H2 sections (“About North Shore Judo,” “Judo Classes for Kids & Adults,” etc.). Sub‑headings label individual classes.
* **Images:** Most images use WebP format and have descriptive `alt` text【737705830272375†L446-L468】.
* **Performance & security:** Fonts and the largest image are preloaded, and the site runs over HTTPS. However, heavy imagery, carousels and third‑party scripts may slow load times.

### Issues (Critical / Medium / Low)
**Critical**
* **404 errors for navigation links:** Users who click or type `/about`, `/classes` or `/contact` see a GitHub Pages 404 page. These broken URLs can harm crawlability and user experience.
* **Single indexable URL:** Only one URL is present in the sitemap. This limits the amount of content search engines can index and constrains opportunities for ranking on specific keyword pages (e.g., dedicated pages for classes, coaches, pricing or FAQs).

**Medium**
* **External sign‑up domain:** The “Sign Up” button sends users to an external domain (`judoprod.koyeb.app`). This can break the user journey, reduce trust and complicate tracking.
* **Lack of contactPoint schema:** While LocalBusiness schema exists, there is no `contactPoint` property for phone or email, nor `sameAs` entries for social profiles beyond Google Maps and a Facebook group.
* **Missing `tel:` and `mailto:` links:** The phone number and email are plain text rather than clickable links, which reduces mobile usability.
* **Potential performance bottlenecks:** Multiple high‑resolution images and an Owl Carousel may slow the site on mobile connections. Cloudflare analytics scripts add extra requests.

**Low**
* **Use of a Gmail address:** The contact email uses a Gmail account instead of a domain‑based address, which appears less professional.
* **No robots meta tag:** A meta robots tag could clarify indexation instructions for potential future pages.
* **No HTML sitemap or breadcrumb links on page:** Aside from structured data, there are no visible breadcrumbs or a human‑readable sitemap for navigation.

### Recommendations
* **Fix broken navigation links:** Either create dedicated `/about`, `/classes` and `/contact` pages that contain the relevant sections (preferred) or set up 301 redirects from these URLs to the appropriate anchors on the homepage. This prevents 404 errors and gives search engines additional pages to index. ✅ **[WILL FIX]**
* **Expand site architecture:** Develop separate, keyword‑optimised pages for core topics: “Kids Judo Classes,” “Junior & Teen Classes,” “Adult Judo,” “About Us,” “Coaches,” “Pricing,” and “Contact.” Each page can target specific search queries, improving organic reach. ✅ **[WILL FIX]**
* **Keep sign‑up within the domain:** Embed the membership registration form within the site or at least host it on a `join.northshorejudo.co.nz` subdomain with SSL. This will maintain trust and keep users on the site. ❌ **[WON'T FIX]**
* **Enhance structured data:** Add `contactPoint` fields in the LocalBusiness JSON‑LD to specify the customer service phone and email, and include `geo` and `sameAs` links for any social media profiles. Consider adding a `sportsTeam` or `Organization` schema for the coaching staff. ✅ **[WILL FIX]**
* **Make contact details actionable:** Convert phone numbers and emails into clickable `tel:` and `mailto:` links to improve mobile usability. Include a map embed or link to Google Maps. ✅ **[WILL FIX]**
* **Optimise images & scripts:** Compress images further (use <200 kb sizes), implement lazy‑loading, and remove unnecessary scripts (e.g., unused carousels) to improve mobile speed. Use tools like Google PageSpeed Insights to diagnose render‑blocking resources. ❌ **[WON'T FIX]**
* **Use a professional email domain:** Adopt a branded email address (e.g., info@northshorejudo.co.nz) to enhance credibility and unify branding across communications. ✅ **[WILL FIX]**

## 2. On-Page SEO & Content
### Findings
* **Comprehensive but single‑page content:** The homepage contains sections for the club’s value proposition, description of the club’s history and mission, a “Judo Classes” section outlining age groups, training times and pricing, a brief introduction to the coaching team and a FAQ. This offers visitors an overview without needing to click elsewhere.
* **Use of keywords:** The copy frequently uses key phrases such as “judo classes in Auckland,” “kids judo,” “junior classes,” “adult judo,” “North Shore” and “Takapuna.” The meta title and description incorporate these keywords【737705830272375†L0-L3】. The structured data further reinforces local and service‑related keywords【737705830272375†L969-L1124】.
* **Clear CTAs:** Multiple calls to action – “Get a free class,” “Join our community,” and “Sign up now” – encourage user engagement. Pricing information is transparent ($36 or $73 per month) and the first class is free【136060713992766†L102-L131】.
* **Club story and credibility:** The about section mentions the club’s founding in 1969 and head coach Simon Greenhill’s recognition as a Judo NZ National Club Coach. This lends authority but provides limited detail about other coaches or achievements【737705830272375†L392-L425】.

### Issues
* **Keyword gaps:** The site doesn’t target broader or related search terms like “martial arts Auckland,” “self‑defence classes,” “judo for adults,” “women’s judo” or “martial arts for fitness.” These terms could attract a wider audience.
* **Lack of supporting content:** There is no blog or news section to publish articles on training tips, competition results, success stories or club updates. This limits fresh content and internal linking opportunities.
* **Minimal internal linking:** Apart from a single “our classes” anchor link, there are few internal links connecting different sections. Search engines use internal links to understand site structure and pass authority.
* **Missing instructor bios and testimonials:** While Simon Greenhill is mentioned, there are no dedicated profiles for the coaching team or testimonials from students/parents. Social proof is absent on the site itself.
* **Limited depth on classes:** The class descriptions briefly mention age ranges, times and price but don’t explain curriculum, belt progression, competition opportunities, class sizes, safety measures or benefits for different audiences.

### Recommendations
* **Create dedicated content pages:** As part of expanding the site architecture, develop pages focusing on specific topics/keywords (e.g., “Kids Judo Classes in Auckland,” “Adult & Teen Judo,” “Self‑Defence & Fitness,” “Women’s Judo”). Include unique meta titles, descriptions and H1s for each page to capture a broader range of search queries. ✅ **[WILL FIX]**
* **Launch a blog or news section:** Publish regular posts about judo techniques, competition results, belt gradings, training tips for beginners, nutrition and club news. This keeps the site fresh, builds topical authority and provides shareable content. ❌ **[WON'T FIX]**
* **Develop instructor bios:** Create a “Coaches” page detailing each coach’s qualifications, Dan rankings, coaching certifications and competition achievements. Add professional photos and personal stories to build trust. ✅ **[WILL FIX]**
* **Incorporate testimonials and case studies:** Collect testimonials from students and parents and display them prominently. Use structured data (`Review` schema) so that search engines may display star ratings in results. ✅ **[WILL FIX]**
* **Improve internal linking:** Link from the about section to class pages, from blog posts to relevant classes or sign‑up pages, and between FAQs and deeper resources. This helps users navigate and distributes page authority. ✅ **[WILL FIX]**
* **Optimise on‑page copy:** Sprinkle synonyms and long‑tail keywords naturally throughout the content (e.g., “martial arts classes,” “self‑defence training,” “judo for beginners,” “fitness benefits of judo”). Expand descriptions of each class to explain training methods, safety practices and benefits for different age groups. ✅ **[WILL FIX]**

## 3. Local SEO
### Findings
* **Visible NAP:** The contact section lists the club’s email (northshorejudo@gmail.com), phone number (+64 27 891 0027) and physical address (34 Barrys Point Road, Takapuna, Auckland 0622). Opening hours for Tuesday and Thursday evenings are displayed.【136060713992766†L47-L58】
* **Structured data:** The LocalBusiness schema includes the full postal address, geo coordinates, price range, opening hours and area served across many North Shore suburbs【737705830272375†L969-L1071】. It also identifies membership in Judo NZ, the Auckland Judo Association and the International Judo Federation【737705830272375†L1127-L1143】.
* **References to local areas:** The about section mentions Takapuna and the North Shore, and the `areaServed` list in structured data covers suburbs like Milford, Albany, Devonport, Birkenhead, Birkdale and others【737705830272375†L996-L1057】.
* **External citations:** A listing on The Family Company directory shows the club’s NAP and receives positive user reviews【769762036237352†L10-L92】. Other major directories (e.g., Judo NZ’s club directory, Judo Info’s global club database) do not list the current North Shore Judo site.【675691721737318†L34-L36】
* **SameAs & Google Maps:** The LocalBusiness schema includes a Google Maps CID link and a Facebook group URL but no direct map embed or link on the page【737705830272375†L1145-L1149】.

### Issues
* **NAP visibility & clickability:** Contact details are only available near the bottom of the page and are not clickable (`tel:`/`mailto:`). The phone number doesn’t appear in the header or footer for quick access.
* **No embedded map:** There is no Google Map embed showing the dojo’s location, which could help visitors find the venue and enhance local relevancy.
* **Limited local citations:** Apart from one directory listing, the club lacks citations on local directories (e.g., Google Business Profile website link, Judo NZ club listings, sports or community directories). The outdated listing on Judo Info references the old name and location, not the current club.
* **Generic email:** Use of a Gmail address instead of a domain email weakens NAP consistency and professional appearance.
* **No dedicated contact page:** The absence of a contact page means search engines cannot index a page specifically targeting queries like “North Shore Judo contact” or “judo club Takapuna address.”

### Recommendations
* **Prominent, clickable NAP:** Display the phone number and email in the header and footer on every page and make them clickable via `tel:` and `mailto:` links. Create a dedicated contact page with a simple form, address, phone, email and opening hours. ✅ **[WILL FIX]**
* **Embed Google Map:** Add an interactive Google Map of the dojo on the contact page and optionally in the footer. This aids visitors and reinforces the business’s local presence. Ensure the embedded map uses the same address as in GMB/structured data. ❌ **[WON'T FIX]**
* **Optimise Google Business Profile (GMB):** Claim or update the Google Business Profile, ensuring the website URL, phone number, address and hours match the site. Add photos, respond to reviews and encourage members to leave reviews. Link to the GMB profile from the website. ❌ **[WON'T FIX]**
* **Expand local citations:** Submit the business to judo and martial‑arts directories (e.g., Judo NZ club listings, local sports directories), general directories (Yellow Pages, Yelp, Localist), and community sites. Ensure NAP details are consistent across all citations. ❌ **[WON'T FIX]**
* **Use a branded email:** Create an email address on the club’s domain (e.g., info@northshorejudo.co.nz) and update the website and citations accordingly. Use this address in the `contactPoint` schema. ❌ **[WON'T FIX]**
* **Include location‑oriented keywords:** In on‑page copy and meta descriptions, incorporate phrases like “judo in Takapuna,” “judo North Shore,” “judo classes near Milford/Devonport/Albany,” etc., to improve local search relevance. ✅ **[WILL FIX]**

## 4. Business & UX
### Findings
* **Clear value proposition:** The hero section and headings quickly communicate what the club offers – judo classes for kids, juniors and adults in Takapuna. A free first class and a “competition‑size dojo” are highlighted.
* **Pricing and timetable included:** The classes section lists age groups, training times (Tuesdays and Thursdays) and monthly pricing ($36 for Pee Wees; $73 for Juniors and Seniors)【136060713992766†L102-L131】.
* **Modern aesthetic:** The site uses bold typography, dark backgrounds and high‑quality images, giving it a contemporary feel. A video placeholder and carousel add visual interest.
* **Simple navigation:** The one‑page design means visitors can scroll to see all content. Anchor links in the header lead to sections for classes, about, coaches and FAQs.

### Issues
* **Broken navigation & limited pages:** Clicking or entering `/about`, `/classes` or `/contact` leads to 404 errors, breaking the user journey. The lack of separate pages restricts the ability to target specific user intents and makes navigation feel shallow.
* **External sign‑up process:** The “Sign Up Now” button launches an external Clubware app (on a different domain). Users are not warned that they are leaving the site, which may reduce trust and hamper conversion tracking.
* **No contact form or map:** Prospective members cannot send inquiries through a form, and there is no embedded map to help locate the dojo. The phone number and email are not clickable, increasing friction, especially on mobile devices.
* **Sparse coach information:** There is no dedicated “Team” or “Coaches” page; only a heading “Our awesome judo coaches” with a photo but no bios or qualifications. Visitors may look elsewhere for more information about instructors.
* **Lack of social proof:** The site does not display testimonials, reviews, success stories, medals or competition results. Visitors cannot gauge the club’s reputation or student experiences.
* **No blog or resources:** Without a blog, news or resource section, there is limited educational content to engage users and demonstrate expertise.
* **Accessibility & usability:** Carousels and accordion FAQs rely on JavaScript and may be less accessible for users with disabilities. There is no skip navigation link or accessible menu structure.

### Recommendations
* **Develop a multi‑page site:** Create separate pages for About, Classes, Pricing, Coaches, Contact and FAQs. Provide detailed information, intuitive navigation and unique meta data for each page. This will improve UX and SEO. ✅ **[WILL FIX]**
* **Integrate sign‑up and contact forms:** Host the membership registration form on the main domain (or a subdomain) and embed a simple contact form on the contact page. Make the phone number and email clickable and display them in the header/footer. ❌ **[WON'T FIX]**
* **Add an interactive map:** Embed a Google Map of the dojo’s location on the contact page and include driving directions or parking information. ❌ **[WON'T FIX]**
* **Publish coach bios:** Introduce each coach with a photo, biography, Dan ranking, coaching certifications and notable achievements. Use this section to build trust and highlight the club’s expertise. ❌ **[WON'T FIX]**
* **Incorporate social proof:** Showcase testimonials from students and parents, competition results, photos of medalists or success stories. Implement `Review` schema to potentially display star ratings in search results. ✅ **[WILL FIX]**
* **Enhance accessibility:** Ensure navigation menus are keyboard accessible, add `aria` labels to interactive elements, and provide alt text for all images. Consider reducing reliance on carousels or providing alternative static content. ❌ **[WON'T FIX]**
* **Offer resources:** Add a blog, FAQs page and perhaps a downloadable timetable or welcome guide for new students. These resources improve engagement and can be shared on social media. ❌ **[WON'T FIX]**

## 5. Competitor Analysis
### Findings
The Auckland judo scene is competitive, with several clubs offering detailed websites and strong local visibility. Key competitors include:

* **Nippon Judo Schools (nipponjudoschools.com):** A North Shore and West Auckland club with a robust website. It features pages for upcoming events, a term‑based calendar, class schedules, enrolment information, fee structure, grading syllabus, an about section and a gallery【692330736056880†L10-L23】【692330736056880†L45-L97】. The site provides bios for founder Johan Boshoff (6th Dan), details on multiple dojos, and a clear call‑to‑action (“Book your first lesson – it’s free!”)【692330736056880†L29-L39】.
* **Howick & St Heliers Judo Club (howickjudo.com):** Serves eastern suburbs of Auckland and offers comprehensive class schedules for beginners, juniors, intermediates and adults【747057695617879†L25-L48】. The website lists training times for each day, provides descriptions of class structure, highlights multiple instructors with their Dan rankings【747057695617879†L72-L77】【747057695617879†L97-L99】, and offers a members’ area, events calendar and gallery.
* **JudoKwai (judokwai.org):** Located in Glenfield (North Shore), this club’s website includes dedicated pages for About Us, First Time, Classes, Pricing, Gradings and Contact. It greets visitors in multiple languages, emphasises both recreational and high‑performance training, and links to active Facebook and Instagram profiles【619743341450790†L104-L124】.

Across these competitors, common strengths include detailed class schedules, instructor bios with belt rankings, events calendars, clear pricing structures, multiple ways to contact or enrol, and active social media integration.

### Recommendations
* **Benchmark against competitors:** Use competitor sites as benchmarks for content depth and user experience. Incorporate features such as detailed timetables, fee breakdowns, event calendars and instructor biographies. ❌ **[WON'T FIX]**
* **Highlight unique selling points:** Emphasise aspects that differentiate North Shore Judo – e.g., the club’s long history (founded 1969), new competition‑size dojo, community atmosphere, affiliations with Judo New Zealand and the Auckland Judo Association, and the quality of coaching. Create content that tells this story and compares favourably against competitors. ❌ **[WON'T FIX]**
* **Expand digital footprint:** Competitors have strong social media presence. Establish and actively manage Facebook, Instagram and YouTube channels to share training clips, competition results and club news. Engage with local judo communities online. ❌ **[WON'T FIX]**
* **Offer value‑added resources:** Provide downloadable timetables, beginner guides, technique tutorials or a welcome pack. Host open days or events and promote them via the website and social channels. These additions will position the club alongside or ahead of competitors. ❌ **[WON'T FIX]**

## 6. Backlinks & Citations
### Findings
* **Few authoritative backlinks:** The site appears to have very limited backlinks. The LocalBusiness schema lists membership in Judo New Zealand and the Auckland Judo Association, but we did not find inbound links from these organisations. An external review site (The Family Company) links to North Shore Judo and includes positive reviews【769762036237352†L10-L92】.
* **Outdated or missing directory listings:** The Judo Info global club directory lists a different “North Shore Judo and Self Defense Academy” with an older contact (Ron Jones)【675691721737318†L34-L36】. North Shore Judo (Takapuna) is missing from many industry and local directories.
* **Social mentions vs backlinks:** Search results show Facebook posts mentioning the club and a property listing referencing the dojo, but these pages are either private or dynamic and may not provide crawlable backlinks.

### Recommendations
* **Claim and optimise authoritative citations:** Ensure the club is accurately listed on Judo NZ’s official club directory, Auckland Judo Association lists, Judo Info, and other martial‑arts directories. Provide correct NAP and a link to the website. ❌ **[WON'T FIX]**
* **Submit to local directories:** Add the business to general directories such as Google Business Profile (with website link), Bing Places, Yelp, Yellow Pages NZ, Localist and sports directory sites. Encourage members to leave reviews on these platforms to build trust signals. ❌ **[WON'T FIX]**
* **Seek backlinks from partners and associations:** Request links from the New Zealand and Auckland Judo associations, local schools where classes are taught, and sports blogs or news sites that cover martial arts. Offer to contribute guest posts or provide quotes on judo topics in exchange for links. ❌ **[WON'T FIX]**
* **Leverage content marketing:** Publishing blog articles, event recaps and instructional content can attract natural backlinks. Share this content on social media and judo forums to encourage referencing. ✅ **[WILL FIX]**

## 7. Social Media
### Findings
* **Existing presence:** The LocalBusiness schema references a Facebook group and a Google Maps listing【737705830272375†L1145-L1149】. Search results reveal a Facebook page for North Shore Judo, but we could not view posts without logging in. There is no evidence of Instagram, Twitter/X, TikTok or YouTube channels.
* **No social links on website:** The website does not display social media icons or links, so visitors cannot easily follow or engage with the club. There is no embedded social feed or mention of community platforms.
* **Competitors’ social activity:** Competitor sites (e.g., Judokwai) link to active Facebook and Instagram profiles, demonstrating regular use of social media for engagement and marketing【619743341450790†L22-L24】【619743341450790†L115-L124】.

### Recommendations
* **Establish official social channels:** Create and maintain official Facebook, Instagram and YouTube accounts under the North Shore Judo brand. Use consistent branding (logo, colours and tone) that matches the website. ❌ **[WON'T FIX]**
* **Integrate social links:** Add social media icons to the website header/footer and within the LocalBusiness schema’s `sameAs` array. Encourage visitors to follow by offering updates on class schedules, competitions and events. ❌ **[WON'T FIX]**
* **Plan a content schedule:** Post regular updates showcasing training sessions, success stories, competition results, technique demonstrations, behind‑the‑scenes content and member testimonials. Use short‑form video (Instagram Reels, TikTok) to appeal to younger audiences. ❌ **[WON'T FIX]**
* **Engage with the community:** Respond to comments, answer questions and encourage user‑generated content. Feature photos or stories from students (with consent) to foster community engagement and increase reach. ❌ **[WON'T FIX]**
* **Cross‑promote:** Share blog articles and website updates through social channels. Conversely, embed an Instagram feed or highlight reel on the website to demonstrate activity and authenticity. ❌ **[WON'T FIX]**

## Priority Action Plan
1. **Fix navigation and create dedicated pages** – Build separate pages for About, Classes, Pricing, Coaches, FAQs and Contact. Redirect existing anchor URLs to these pages to eliminate 404 errors. *(Impact: High, Effort: Medium‑High)* ✅ **[WILL FIX]**
2. **Implement on‑site sign‑up and contact forms** – Host registration and enquiry forms on the main domain (or subdomain) and make phone/email clickable. *(Impact: High, Effort: Medium)* ❌ **[WON'T FIX]**
3. **Claim and optimise Google Business Profile** – Ensure NAP consistency, add photos, respond to reviews and embed a Google map on the site. *(Impact: High, Effort: Low)* ❌ **[WON'T FIX]**
4. **Launch a blog and publish regular content** – Create a news/resources section and post articles on judo techniques, club updates, competition results and training tips. *(Impact: High, Effort: High)* ❌ **[WON'T FIX]**
5. **Expand keyword targeting** – Optimise on‑page copy for broader phrases (“martial arts Auckland,” “self‑defence classes”) and create dedicated pages for each audience segment. *(Impact: Medium‑High, Effort: Medium)* ✅ **[WILL FIX]**
6. **Earn citations and backlinks** – Submit the club to Judo NZ directories, local sports directories and general citation sites; request links from partner organisations and local schools. *(Impact: Medium‑High, Effort: Medium)* ❌ **[WON'T FIX]**
7. **Publish coach bios and testimonials** – Create detailed profiles of coaches and collect testimonials from students/parents. Implement `Review` schema for testimonials. *(Impact: Medium, Effort: Low‑Medium)* ✅ **[WILL FIX]**
8. **Optimise images and performance** – Compress images, implement lazy‑loading and remove unnecessary scripts to improve mobile load times. *(Impact: Medium, Effort: Low)* ❌ **[WON'T FIX]**
9. **Establish and integrate social media channels** – Create official Facebook, Instagram and YouTube accounts, link them from the website and post engaging content. *(Impact: Medium, Effort: Medium)* ❌ **[WON'T FIX]**
10. **Use a professional email & update NAP** – Adopt a branded email address (e.g., info@northshorejudo.co.nz) and ensure NAP is consistent across the site, structured data and all citations. *(Impact: Low‑Medium, Effort: Low)* ✅ **[WILL FIX]**