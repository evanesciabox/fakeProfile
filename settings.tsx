import { definePluginSettings } from "@api/Settings";
import { OptionType } from "@utils/types";
import { Button } from "@components/Button";
import { Notice } from "@components/Notice";
import { useCspPermission } from "@utils/csp";
import { API_URL, CDN_URL } from "./constants";

function ApiUrlNotice({ url }: { url?: string; }) {
    const [isAllowed, allow] = useCspPermission(url, ["connect-src", "img-src"], "fakeProfile");
    if (isAllowed || !url) return null;

    return (
        <Notice variant="warning" action={<Button size="small" variant="secondary" onClick={allow}>Allow Host</Button>}>
            Connections to {URL.parse(url)?.host} are blocked. Allow this host if you trust it, then restart Discord.
        </Notice>
    );
}

export const settings = definePluginSettings({
    nitroFirst: {
        description: "Things to use if both Nitro and fakeProfile features are present",
        type: OptionType.SELECT,
        options: [
            { label: "Nitro", value: true, default: true },
            { label: "fakeProfile", value: false },
        ]
    },
    showAvatar: {
        description: "Showing fakeProfile's avatar (requires in Nitro First set option \"fakeProfile\")",
        type: OptionType.BOOLEAN,
        default: false,
        restartNeeded: true
    },
    showBanner: {
        description: "Showing fakeProfile's banner (requires in Nitro First set option \"fakeProfile\")",
        type: OptionType.BOOLEAN,
        default: false,
        restartNeeded: true
    },
    voiceBackground: {
        description: "Use fakeProfile banners as voice chat backgrounds",
        type: OptionType.BOOLEAN,
        default: false,
        restartNeeded: true
    },
    preferNameplate: {
        description: "Displays fakeProfile's nameplates picture which are present (remove Discord's nameplate before use this, or it will looks weird in member list)",
        type: OptionType.BOOLEAN,
        default: false
    },
    enableCustomBadges: {
        description: "Displays fakeProfile's custom badges",
        type: OptionType.BOOLEAN,
        default: false,
        restartNeeded: true
    },
    apiUrlPermission: {
        type: OptionType.COMPONENT,
        component: () => <ApiUrlNotice url={API_URL} />
    },
    cdnUrlPermission: {
        type: OptionType.COMPONENT,
        component: () => <ApiUrlNotice url={CDN_URL} />
    }
});
