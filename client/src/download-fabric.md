{{#extend "layouts/download-version" platform-text="for Minecraft: Java Edition + Fabric" }}
{{#content "main"}}
{{#markdown}}

## Version info

{{!-- server-side rendering --}}

-   Version: \{{meta.version}}
-   Minecraft Version: >=\{{meta.min_minecraft_version}}
-   Built on: \{{meta.datetime_str}}

## Install instructions

1. Install fabric (instructions coming soon).
2. Place the Lucky Block .jar file in your <a href="https://minecraft.gamepedia.com/.minecraft">.minecraft</a>/mods folder.
3. Run Minecraft again, now with the Lucky Block installed.

{{/markdown}}
{{/content}}
{{/extend}}
