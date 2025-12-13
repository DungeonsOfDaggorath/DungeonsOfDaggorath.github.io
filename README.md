# Dungeons Of Daggorath

## Source Code / Development

The source code for Dungeons of Daggorath web port is broken into two repositories.  First, this repository is for the main website that hosts the game.  The second repository is the C++ code for Dungeons of Daggorath itself, modified for webassembly.

### Website

The website is written using [Jekyll](https://jekyllrb.com/) and hosted using [GitHub](https://github.com/).

### Deployments (Production + Branch Previews)

This repo uses **GitHub Actions + GitHub Pages** to publish:

- **Production**: `master` deploys to the site root (`/`)
- **Previews**: any non-`master` branch deploys to `/preview/<branch-name>/`

Previews are stored under the `gh-pages` branch and do **not** overwrite production content.

#### One-time setup: seed the `gh-pages` branch from current `master`

Because local `bundle exec jekyll build` may not match GitHub’s build environment, the repo includes a manual GitHub Actions workflow that seeds `gh-pages` directly in CI using the same toolchain.

1. Push the workflows in this repo to your branch.
2. In GitHub, go to **Actions** → **Seed gh-pages from master** → **Run workflow**.
3. Leave **deploy=true** (default) so it seeds `gh-pages` and deploys it immediately.

After this, pushing `master` updates the root (while preserving `preview/`), and pushing feature branches updates only their preview subdirectory under `/preview/<branch-name>/`.

_Local Installation_

1. Clone this repository
2. [Install Jekyll](https://jekyllrb.com/docs/installation/) - including any dependencies
3. Setup the C++ source code (see below)


Locally, you can test out the website using:

    bundle exec jekyll serve

### C++ Source Code

The source code is written in C++, using [emscripten](https://emscripten.org/) for the web port.

_Local Installation_

See the main repo at https://github.com/cognitivegears/DungeonsOfDaggorath for installation and development instructions

On the website, the C++ code is include in the "daggorath" submodule in the source code.  A Makefile is also included in the website version to build a new version of Daggorath for the website.  To run a build, use the following commands:

    make clean
    THREAD_POOL_SIZE=4 make wasm

The `wasm` target invokes `emmake` under the hood, so make sure the Emscripten SDK environment is activated (or set `EMMAKE` to the path of `emmake`) before running it. By default the build allocates four worker threads; override this by passing `THREAD_POOL_SIZE=<n>` to any of the make targets (`wasm`, `site`, `serve`, `serve-local`).

Because WebAssembly threads require `SharedArrayBuffer` support, you must serve the generated site with cross-origin isolation headers. Two convenience targets are provided:

```
make serve        # builds via Jekyll into _site/ and serves that tree with emrun
make serve-local  # serves a standalone index.local.html without running Jekyll
```

After either command finishes, open http://localhost:8080/index.html (or index.local.html) in a browser that supports SharedArrayBuffer (Chrome, Edge, or Firefox with `dom.postMessage.sharedArrayBuffer.withCOOP_COEP` enabled).

For more instructions on local installation, including installing dependencies, see the [main repo](https://github.com/cognitivegears/DungeonsOfDaggorath).

## How to Play

Dungeons of Daggorath is hosted at https://daggorath.online

Some of the following information has been extracted from https://archive.org/stream/Dungeons_of_Daggorath_1983_Tandy/Dungeons_of_Daggorath_1983_Tandy_djvu.txt

<table>
<tr><th>Command</th><th width="150">Modifiers</th><th width="140">Abbreviation<br/>Example</th><th>Usage</th></tr>
<tr><td>MOVE</td><td>[None]<br/> BACK<br/> LEFT<br/> RIGHT</td><td>M<br/> M B<br/> M L<br/> M R</td><td>Step one cell in direction</td></tr>
<tr><td>TURN</td><td>LEFT<br/> RIGHT<br/> AROUND</td><td>T L<br/> T R<br/> T A</td><td>Turn in current cell</td></tr>
<tr><td>CLIMB</td><td>UP<br/> DOWN</td><td>C U<br/> C D</td><td>Climb up a ladder. Climb down a ladder or a hole.</td></tr>
<tr><td>EXAMINE</td><td>[None]</td><td>E</td><td>Show a list of items on the floor of the cell you occupy plus a list of everything you are carrying in your backpack.</td></tr>
<tr><td>LOOK</td><td>[None]</td><td>L</td><td>Look at the Dungeon after an EXAMINE command.</td></tr>
<tr><td>GET</td><td>[HAND] [ITEM]</td><td>G R T<br/> G L SW</td><td>Get an object from the floor with your left or right hand. Note: The object you type must be on the floor of the cell you occupy, and the hand you choose must be empty.</td></tr>
<tr><td>PULL</td><td>[HAND] [ITEM]</td><td>P R T<br/> P L SW</td><td>Pull an object from your backpack. Note: The object you type must be in your backpack, and the hand you choose must be empty.</td></tr>
<tr><td>STOW</td><td>[HAND]</td><td>S R<br/> S L</td><td>Stow the object in your hand into your backpack.</td></tr>
<tr><td>DROP</td><td>[HAND]</td><td>D L<br/> D R</td><td>Drop the object in your hand to the floor.</td></tr>
<tr><td>ATTACK</td><td>[HAND]</td><td>A L<br/> A R</td><td>Attack with the object in your hand.</td></tr>
<tr><td>USE</td><td>[HAND]</td><td>U L<br/> U R</td><td>Use the object in your hand.</td></tr>
<tr><td>REVEAL</td><td>[HAND]</td><td>R L<br/> R R</td><td>Attempt to reveal the type of object in your hand.</td></tr>
<tr><td>INCANT</td><td>[MAGIC WORD]</td><td>I STEEL</td><td>Attempt to conjure up the magic power of a RING by incanting its magical name. Note: When you INCANT, type only the single wotd you are incanting, such as INCANT STEEL.</td></tr>
<tr><td>ZSAVE</td><td>[SAVE NAME]</td><td>ZS SAVEONE</td><td>Saves your game.</td></tr>
<tr><td>ZLOAD</td><td>[SAVE NAME]</td><td>ZL SAVEONE</td><td>Loads your game.</td></tr>
<tr><td>RESTART</td><td>[None]</td><td>RESTART</td><td>Restarts from the beginning.</td></tr>
</table>

There are several types within each of these object classes. For example, a
TORCH can be a PINE TORCH or a LUNAR TORCH. The chart below will
clarify the various types of objects. The types of RINGs, however, will not be
listed in the chart. You must discover them yourself.

<table>
<tr><th>Item</th><th>Revealed Items</th></tr>
<tr><td>TORCH</td><td>PINE, LUNAR, SOLAR</td></tr>
<tr><td>SWORD</td><td>WOODEN, IRON, ELVISH</td></tr>
<tr><td>SHIELD</td><td>LEATHER, BRONZE, MITHRIL</td></tr>
<tr><td>FLASK</td><td>HALE, ABYE, THEWS</td></tr>
<tr><td>SCROLL</td><td>VISION, SEER</td></tr>
<tr><td>RING</td><td>Not Listed.</td></tr>
</table>

When you first enter the Dungeon, you will be given a backpack containing a
PINE TORCH and a WOODEN SWORD.

A popular start is as follows:<br/>
M<br/>
M<br/>
M<br/>
M<br/>
P R T<br/>
U R<br/>
P L SW<br/>
T L<br/>

CHEATS | EFFECT
--- | ---
SETCHEAT NONE | Disable all active cheats.
SETCHEAT ITEMS |
SETCHEAT INVULNERABLE |
SETCHEAT CRTSCALE |
SETCHEAT REVEAL |
SETCHEAT RING |
SETCHEAT TORCH |

For game options press ESC and use arrow keys to navigate the menu. Left/Right will switch between menus.
