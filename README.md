# Study Orbit

A simple student study planner with a deep-space background, sunshine-yellow controls and pixel artwork. This is a **new, separate website**. It does not connect to or modify Four Pillars.

## What it does

- A flexible **Subject → Topic → Subtopic** hierarchy, for example **Physics → Kinematics → Motion in a straight line**. Names, parent subjects, subtopic labels and study status are editable.
- Each subtopic dashboard combines Planned / Studying / Completed status, studied-on date, revision count, last/next revision, full revision history, notes, test marks and a test-percentage graph.
- A Revisions section separates planned, due/overdue and completed revisions. The first revision uses a configurable week gap; later revision dates are chosen manually. A planned revision creates a linked study task and appears once in the calendar.
- Click Studied to log completion and schedule the first revision in one step. Complete revision logs today with one click, or use Log with notes for the actual date and recall notes. No later revision is scheduled until you choose its date.
- Add a daily task inline with only its title and linked subtopic; click its title later to edit dates, study time, priority and notes.
- **Upcoming task**, directly beneath daily tasks, combines unfinished task deadlines, calendar events, planned revisions and assessment dates for **today plus the next two local dates**. Past dates disappear automatically, including at local midnight while the dashboard stays open.
- Log tests for the whole course (all subjects), a subject, a topic, or a subtopic. Each subtopic has a large Log test button beside its study/revision controls. The central Tests page has four quick-log choices, actual marks, maximum marks, date, optional series and reflection notes. Graphs, summary statistics and the result log use the same subject/topic/subtopic, coverage-level, series, label and period filters. Subject views include their descendants; topic views include their subtopics. Whole-course mocks keep their overall score and are not split into individual subject marks. Compare similar tests; percentage does not adjust for difficulty.
- A compact editable Pomodoro station keeps study/rest analytics behind a button. It records partial periods and daily totals with a monthly graph.
- A restrained deep-space black, blue and sunshine-yellow theme. The focus station keeps a small cat that studies, eats ramen or sleeps. Each main section has one matching header illustration, Daily Tasks has a spaceship, and Upcoming has its navigator. Art is not repeated inside list rows or cards.
- Larger section artwork remains limited to one illustration in each relevant section.
- Click a subtopic title for notes and its last-updated date. Dates are recorded from changes going forward; older entries display Not recorded. Select one or several subtopics to create one study task, with their titles included in task notes.
- Subjects stay as cards. Topics appear as spacious full-width list cards with progress, subtopic counts, test totals, latest scores and assessment dates. Subtopics use status-colored rows with quick Planned/Studying/Studied controls, revision and test logging, history links, and expandable study-date, next-revision-date and first-revision-gap fields. Tasks use concise list rows with title, linked study context, deadline, time, priority and status.
- A 30-day calendar supports inline task/result/assessment edits and per-date event creation. Backups use downloaded JSON and pasted restore text.

All planner data stays in browser localStorage. There are no attachment uploads, application accounts, analytics, server database or third-party runtime dependencies. The hosted Sites preview is owner-private; the downloadable app has no sign-in requirement.

## Source files

The downloadable folder puts the deployable files directly alongside this guide:

```text
study-orbit/
  index.html          Page shell and navigation
  styles.css          Theme, layout and animations
  model.js            Data model, validation and browser persistence
  app.js              Screens, forms, calendar and interactions
  hierarchy.js        Subject tree, subtopic dashboards and revision workflows
  tests.js            Test coverage forms, linked logging and results explorer
  favicon.svg         App icon
  assets/             Local pixel artwork, including eight cat/spaceship scenes
  README.md           This guide
  ASSET-NOTES.md      Cat artwork prompts and asset paths
  tools/check.cjs     Optional checks with Node 24 (no packages needed)
```

In the Sites source repository, the same deployable files are under `dist/`. There is no compilation or generated bundle: the HTML, CSS and JavaScript are the actual source code.

## 1. Run locally

**Quickest:** extract the ZIP and double-click `index.html`. Current browsers can run the classic scripts directly. If your browser restricts local-file storage or treats file URLs inconsistently, use a small local server instead.

**Recommended for predictable storage:** open a terminal in the extracted folder containing `index.html`, then, with Python installed:

```bash
python -m http.server 8080 --bind 127.0.0.1
```

On Windows, `py -m http.server 8080 --bind 127.0.0.1` also works. Visit **http://127.0.0.1:8080**. Keep using the same address and port so the browser finds the same saved data. Stop the server with Ctrl+C.

No Node.js, package installation, build command, API keys or Cloudflare account is needed. A local server only serves files; planner data remains in browser localStorage.

## 2. Host on Netlify

1. Extract the ZIP. Locate the **study-orbit folder that directly contains index.html**.
2. Open https://app.netlify.com/drop and sign in to your Netlify account so you can manage the deployment.
3. Drag that entire folder to the drop zone. Include the CSS, all four JavaScript files, favicon and assets folder.
4. Open the URL Netlify returns. Start adding your subjects and study tasks.
5. For updates, edit your files and upload the updated folder to the **existing project's** Deploys drop zone. Keep the same website address if you want browser data to stay available.

No build command, environment variables or backend conversion is required. This is a static site. Official Netlify instructions: https://docs.netlify.com/start/quickstarts/netlify-drop-quickstart/

For Git-connected hosting, use no build command and choose the directory containing `index.html` as the publish directory (`.` for this ZIP, `dist` for the Sites repository). Other static hosting services can serve the same files.

## Using the planner

1. **Subjects → Add subject:** create Physics, Chemistry, Biology, Mathematics, or any other subject name.
2. **Subject → Add topic:** create Kinematics under Physics. Choose Studying, Testing or both. Optionally enter initial subtopic titles, one per line. Edit the topic’s parent subject to move it.
3. **Topic → Studying:** open Motion in a straight line. Use large Planned, Studying and Completed controls. Completed tags show the actual revision count. Edit subtopic changes its name, labels, notes, completion date and first revision gap. Subtopics have no percentage bar. Subject/topic bars show the proportion of subtopics completed.
4. **Studied:** records completion and schedules the first revision automatically, in the revision log, calendar and linked task list. The default gap is one week; adjust it before clicking Studied (1–104 weeks, half-week steps supported). Selecting Completed also follows this same workflow. Repeated clicks preserve the original completion date and do not create duplicates. Existing revision plans are kept.
5. **Revisions:** open Planned, Due & overdue or History. Complete revision records today immediately. Change date opens a large date picker. Rescheduling updates the same plan and linked task; one next plan is kept per subtopic. The calendar entry opens its date controls.
6. **Later revisions:** after completing a revision, use Choose next revision date and pick a date manually. Completion never schedules another revision. Log with notes records a past completion date, recall quality and notes. Completing a revision task opens that log form. Deleting a planned revision task cancels its plan too. Completed history remains until you explicitly remove it. Reopening study status or canceling a revision does not restart automatic scheduling.
7. **Subtopic → Log test:** the study item is preselected; enter a test name, date, marks and maximum marks. Expand Change location to choose another item or coverage level. Use Tests in the sidebar to log whole-course, subject, topic or subtopic results directly. Choose a Subject, Topic or Subtopic in the result explorer to filter the graph, statistics and log together. Test coverage restricts results to one level; Clear filters returns to all results. Optional series names help compare similar tests. Negative and zero marks are supported. Results can be edited or deleted.
8. **Daily tasks → Add task here:** opens title and subtopic fields in the console. It pins the task to the top three. Click a saved title for full editing. Archive or unpin one if three are already pinned. A completed focus task stays visible until you archive or delete it.
9. **Upcoming task:** shows today and the next two dates; unfinished overdue revisions remain discoverable under Revisions → Due & overdue. This dashboard list is a near-term view, not a notification service.
10. **Calendar:** use Add here inside a date card for a task, or + Event for an event with optional start/end times and notes. Select task, assessment or result labels for inline editing. Select a revision to reschedule it. Arrows move 30 days.
11. **Daily focus station:** Edit focus & rest opens large timing fields. Applying timings resets and pauses the current period. Automatic phase advance is optional; manual skipping does not count an unfinished focus period. The timer advances once when a stored finish timestamp has expired, without inventing closed-page sessions.
12. **Study & rest hours:** expands daily totals, a selectable monthly graph and exact daily breakdown. Partial running periods count; paused time does not. Midnight splits use the browser’s local timezone. Past activity is not invented.
13. **Settings & backup:** edit suggested labels, download a backup, or paste a backup to restore it. No file is uploaded.

### Existing data

Versions 1, 2, 3, 4 and 5 upgrade in memory while preserving the original browser key. Old “subjects” become **topics** and old chapters become **subtopics**, keeping their IDs, notes, progress, tasks and test links. Topics with one shared non-Other subtopic category are grouped under that subject; otherwise they go into **Unsorted**. You can move any topic using Edit topic. Version 4 study percentages become Planned (0%), Studying (between 0% and 100%), or Completed (100%), with existing dates, revision history, and task/test links preserved. No revisions are generated just by loading older data.

Only the previously recorded last-revised date is imported as one known history entry. Earlier revision counts were not stored and are not invented. New backups are version 6 and include the hierarchy, revisions, events, tests and timer activity. Version 5 test records retain their marks, dates, series, notes and links. Linked chapter results become subtopic tests, linked topic results become topic tests and unlinked overall results become whole-course tests. Removed-item results keep historical names and their original coverage. Original course/topic links still resolve.

Deleting a topic or subtopic keeps completed revision history and test results with historical names. Pending revisions and their linked tasks are canceled. Other tasks are retained and their removed links are cleared. Test results and completed revision history can be deleted separately.

## Where data is stored

All subjects, topics, subtopics, revisions, events, tests, tasks, recorded hours and settings use the browser's localStorage key `study-orbit:v1`. Nothing is uploaded to a server. Course-page links open only when you click them. Pixel images, styles and scripts are included in the download; there are no CDN calls.

The app starts empty. Data is separate for each browser profile, device and website origin. A hosted copy, a localhost copy, and a file copy will not automatically share data. Download a backup and restore it by pasting to move between them.

Clearing browser/site data or using private browsing can remove your planner. **Export backups regularly.** This is browser storage, not synchronization or cloud backup. On storage failure the app reports “Not saved” and leaves the previous saved data in place. Unreadable data is not automatically overwritten; Settings offers a recovery download and an explicit reset.

## Customize

- Colours: change `--yellow`, `--bg`, `--text` and other variables at the start of `styles.css`.
- Pixel images: replace files in `assets/`, retaining their filenames or updating `app.js`.
- Layout and planner behavior: edit `app.js`, `hierarchy.js`, `tests.js` and `styles.css`.
- Storage and validation: edit `model.js`. Keep backup compatibility in mind when changing its schema.

Motion respects the device's “reduce motion” setting. Navigation and input controls support keyboard use. Small screens use a compact top navigation bar.

## Verification

JavaScript syntax, three-level legacy migration, automatic first revision with duplicate-click protection, explicit manual later dates, status migration, revision scheduling/completion/cancellation with task/calendar synchronization, three-day upcoming boundaries, inline daily tasks, events, persistence and backup safety, subject/chapter/test editing, four-level test coverage migration, hierarchy-filtered graphs/statistics/logs, test creation/editing and retained historical coverage, zero/negative marks, Pomodoro timings and phase transitions, partial study/rest accounting, midnight/month boundaries, monthly graphs, inline calendar editing, dashboard disclosures preserving timer state and draft timings, all three cat states, deletion with retained history, and screen rendering/interactions were checked with Node-based checks. A real-browser visual/device test was unavailable in the build environment. Test your chosen browser after opening or deploying the files.
