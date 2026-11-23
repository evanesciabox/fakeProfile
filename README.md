<div align="center">

# fakeProfile
An userplugin for Equicord/Vencord modded clients and alternative for [original fakeProfile plugin](https://github.com/gujarathisampath/fakeProfile).

</div>

## Getting started
Remember that developer of this userplugin will not do PR to Vencord or Equicord repositories as new plugin. It's useless and will be better stay as userplugin which is anyone can download and install or not. And also check [About API](#about-api) to get information about that which domain this plugin uses to storage files and data.

## Installation
> [!WARNING]
> Before to install userplugin, you need a dev build of one modded client!!
>
> To do build from source with Equicord: [check here](https://docs.equicord.org/installing/#building-from-source)
>
> To do build from source with Vencord: [check here](https://docs.vencord.dev/installing/)

> [!NOTE]
> Also check [CSP moment](#csp-moment) after installation and enabling plugin, when you reach out the problem with loading images and more.

1. In your build folder of modded client, make `userplugins/` folder with this command:
    ```sh
    $ mkdir src/userplugins
    ```
    - It's not implented by default, so you need to make it yourself. Without that you can't use this plugin as userplugin.
    - Also it'll not infect to update your build client and you don't need to clone this into `equicordplugins/` or `plugins/`. But don't clone it to `equicordplugins/` or `plugins/`.

2. Go to `src/userplugins/` and clone this repository:
    ```sh
    $ git clone https://github.com/evanesciabox/fakeProfile.git
    ```

3. Done. After it you need build it:
    - If you using Equibop/Vesktop:
        1. Build it with this command:
            ```sh
            $ pnpm build
            ```
        2. After that go to `Settings > Equibop/Vesktop settings > scroll down until "Developer Options" > Press "Open Developer Settings"`
        3. And choose *only* dist folder like this path: `/home/user/Equicord/dist`
        4. Restart your Equibop/Vesktop client.
    - If you using default desktop client:
        1. Build it with this command:
            ```sh
            $ pnpm build
            ```
        2. Close your Discord properly and type this command:
            ```sh
            $ pnpm inject
            ```
            - Choose there any path to Discord
        3. After injecting open your Discord client, enable plugin and done.

4. Enjoy.

## How to apply avatar, banner, nameplate and badges
You need to join this [Discord server](https://discord.gg/bXRmrt7E38) and go to `#commands` channel to request something of these things.

## CSP moment
In Vencord there's problem with CSP that it accepts only from mod-sided list and can be added in here with only modify CSP file. I don't know what happened with CSP now, but I'd recommend you use Equicord, which allows you allow hosts if it is not in mod-sided list.

- In Equicord you need just go to `Settings > Themes` allow domains: `https://evanesciabox.cc` and `https://storage.evanesciabox.cc`, then it says to reload your Discord. Do it. And it's done.

## About API
The plugin using *only* own domain API such as `https://evanesciabox.cc` and not using others and related *only* with this project.

- This API stores only those data:
    1. Users ID for rendering fakeProfile things.
    2. Files are storing in `https://storage.evanesciabox.cc`.

`https://evanesciabox.cc` (which will be named as EvanesciaBox next) is a Russian invite-only file exchanger and it's not linked with any suspicious/dangeours actions. About EvanesciaBox read here: https://evanesciabox.cc/about but it's on Russian, so I recommend to use DeepL as machine translator.

If you have any questions about file-sharing service or the API, contact to developer of EvanesciaBox here: evanesciabox@proton.me or https://t.me/evanesciabox?direct
