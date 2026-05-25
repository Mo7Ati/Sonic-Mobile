import { bootstrap } from "@/services/bootstrap";
import { SplashScreen } from "expo-router";
import { useEffect } from "react";

export default function Bootstrap() {
    useEffect(() => {
        (async () => {
            try {
                await bootstrap();
            } finally {
                SplashScreen.hide();
            }
        })();
    }, []);

    return null;
}
