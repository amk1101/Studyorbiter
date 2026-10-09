# Pixel artwork

## Pomodoro cat states

Created with the built-in image-generation tool, using the imagegen skill. Both are PNGs with genuine transparency and are bundled locally in the website. Focus uses the studying image; short rests use the ramen image; long rests use the sleeping image. CSS adds a subtle floating motion while a period runs and respects reduced motion.

Repository paths:

- `dist/assets/cat-focus.png`
- `dist/assets/cat-rest.png`

In the source ZIP these are `study-orbit/assets/cat-focus.png` and `study-orbit/assets/cat-rest.png`.

### Focus generation prompt

Use case: stylized-concept. Asset type: transparent pixel-art sprite for Study Orbit Pomodoro focus station. Create a cute cream and orange cat sitting in a small spaceship cockpit, working hard studying: focused friendly eyes, one paw at a chunky keyboard, open book beside the keyboard. Cockpit has deep black and restrained dark blue panels, sunshine yellow control lights. Retro chunky crisp pixel art, solid block pixels, very limited palette, no gradients, no realistic textures. Single self-contained front three-quarter cockpit vignette with cat as dominant readable subject, compact square silhouette, clean truly transparent exterior, generous clear padding. This should look clear at 180–240px display size. Cozy industrious atmosphere. No text, logos, letters, numbers, borders, watermark, or unrelated objects. Output only the sprite on genuine transparent background.

### Rest edit prompt

Reference image: `cat-focus.png`. Transparent background requested.

Use case: precise-object-edit. Asset type: transparent pixel-art sprite for Study Orbit Pomodoro rest station. Input image is the edit target and character/style reference. Create the break-time counterpart: keep the same recognizable cream and orange cat, same compact blue/black spaceship cockpit silhouette, same sunshine yellow console lights, and same crisp chunky retro pixel art. Change the cat's activity to happily eating ramen, eyes cheerfully closed in a gentle smile, one paw holding chopsticks lifting noodles and the other holding a small warm ramen bowl in front of the cat. The keyboard/book are pushed aside and no longer the focus; bowl, noodles and eating pose must be unmistakable at 180–240px. Keep cockpit, seat, cat markings and uniform consistent. Maintain genuinely transparent exterior around the entire vignette with clear padding. No text, logos, letters, numbers, borders or watermarks. No realistic textures.

## Additional graphics

`dist/assets/pixel-subjects.svg` and `dist/assets/pixel-calendar.svg` are editable code-native pixel graphics made for the subject cards, subject bay and calendar. The subjects graphic is a spaceship study pod with a yellow-lit book cockpit; the calendar is a pixel spacecraft console with a date grid, dish and thrusters. Both use crisp pixel edges and the black, blue and sunshine-yellow palette. The earlier spaceship and study illustrations remain bundled in `dist/assets/`.

## Long-rest cat and detailed spaceship graphics

`dist/assets/cat-sleep.png` was created with the built-in image-generation tool, using `cat-rest.png` as the edit target. It preserves the orange-and-cream cat and yellow-lit cockpit while changing the action to sleeping under a navy blanket. Real alpha transparency is retained.

Final edit prompt:

> Use case: precise-object-edit. Asset type: transparent pixel-art scene for Study Orbit long-rest Pomodoro mode. Edit target: the attached orange-and-cream cat eating ramen in a spaceship cockpit. Create the third matching state: the SAME orange-and-cream cat is peacefully asleep, curled in a cushioned reclined cockpit seat under a dark blue blanket, eyes closed, small yellow pixel Z symbols above the head. Remove ramen, chopsticks and food. Keep the same detailed chunky retro game pixel-art technique, dark outline, navy and black spaceship, sunshine-yellow console lights, rounded star-window pod, orange cat identity, framing, scene scale and genuinely transparent background. A calm sleepy atmosphere. The cat and spaceship must remain recognizable at 200px display size. No text other than small Z symbols, no watermark, no flat opaque background. Preserve real alpha transparency outside the scene.

The editable `pixel-subjects.svg` now shows an orbital library with shelves of books, a star window, console lights and an open book. `pixel-calendar.svg` shows a detailed spacecraft calendar console with a date grid, solar panels, antenna and yellow navigation controls. These two existing SVGs were updated directly in code.

## Revision and navigator cats

Two additional transparent PNG scenes were created with the built-in image-generation tool, using `cat-focus.png` as the same-character reference. They retain genuine alpha transparency and the blue/black/yellow cockpit theme. The original five graphics were preserved. New scenes appear on the Revisions/subtopic pages and upcoming-task panel.

- `dist/assets/cat-revision.png`: cat recalling answers from flashcards.
- `dist/assets/cat-pilot.png`: cat navigating its spaceship with a glowing map and rocket.

### Revision scene prompt

Use case: precise-object-edit. Edit target is the attached Study Orbit cat studying in its spaceship. Create a matching transparent pixel-art revision scene: the same orange-and-cream cat holding a small stack of flashcards and recalling an answer, with a small glowing yellow circular-arrow emblem on the cockpit console. Keep its identity, detailed chunky retro pixel style, navy/black spaceship pod, sunshine-yellow lights, star window, scene framing and real alpha transparency. No readable words, numbers or logos. Do not include ramen or a blanket.

### Navigator scene prompt

Use case: precise-object-edit. Edit target is the attached Study Orbit cat studying in its spaceship. Create a matching transparent pixel-art navigation scene: the same orange-and-cream cat wearing a little navy pilot cap and steering its spaceship, with a holographic star-map on the console and a small forward-facing rocket model beside it. Keep its identity, detailed chunky retro pixel style, navy/black spaceship pod, sunshine-yellow lights, star window, scene framing and real alpha transparency. No readable words, numbers or logos. Do not include food.

## Cat crew across study areas

Three additional illustrations were generated with the built-in image-generation tool. `cat-pilot.png` was supplied as character/style guidance; the new scenes preserve the orange-and-white cat, navy/black ship, warm yellow lights, detailed retro pixel edges and transparent exterior.

- `dist/assets/cat-calendar.png`: a cat navigator with a holographic calendar grid; used in the calendar banner and today's date card.
- `dist/assets/cat-subjects.png`: a cat librarian with books in a spaceship library pod; used on subject/topic cards, subject banners and study overview panels.
- `dist/assets/cat-tests.png`: a cat holding a pencil over a test sheet, with a score display; used on Tests, subtopic test panels and empty result graphs.
- Existing `dist/assets/cat-focus.png`: reused on daily tasks, the study-task banner and task rows. Existing Pomodoro/revision cat scenes remain in place.

The larger banner sprites float gently. Card sprites move slightly and gain a yellow glow on hover/focus. Reduced-motion preferences disable these movements. Decorative images have empty alt text; prominent scene images have descriptive alt text.

### Shared final prompt

Use case: stylized-concept. Asset type: transparent pixel-art UI illustration for Study Orbit, small dashboard card decoration. Match the supplied reference orange-and-white cute cat character and blue-black spaceship with sunshine-yellow console lights. Genuine crisp retro pixel illustration with stepped hard edges, no smooth painting, no blur, no text, no watermark. One compact self-contained spaceship room, front three-quarter isometric view, strong cat silhouette readable at 100px. Navy and midnight black hull, pale cream cat with orange patches, warm yellow accents, restrained cyan screen accents. Transparent background outside the scene; generous clear margins. Reference image is style/character guidance only.

### Calendar prompt suffix

The cat is a spaceship navigator looking at a large glowing holographic calendar grid with simple yellow squares and a tiny orbit marker, one paw planning a route. Distinct calendar device foreground, star porthole behind.

### Subjects prompt suffix

The cat is a spaceship librarian selecting an open yellow-edged book from two compact shelves of blue and yellow books inside a small library pod with a round star porthole. Clear book/library motif.

### Tests prompt suffix

The cat is focused taking a test at a spaceship console, holding a pencil above a large examination sheet with simple checkmarks, a small glowing upward score graph beside the paper, round star porthole behind. No letters or numbers.
