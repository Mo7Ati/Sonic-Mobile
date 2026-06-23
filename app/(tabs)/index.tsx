import React, { useCallback } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTranslation } from 'react-i18next';

import { Header } from '@/components/home/Header';
import { HomePageSkeleton } from '@/components/home/HomePageSkeleton';
import { SectionRenderer } from '@/components/home/SectionRenderer';
import { BorderRadius, Spacing } from '@/constants/theme';
import { useHomeSections } from '@/hooks/react-query-hooks/use-home-sections';
import { useAppTheme } from '@/hooks/use-app-theme';
import { parseApiError } from '@/lib/api';
import { useLastSelectedAddress } from '@/stores/app-prefs-store';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const { t } = useTranslation(['general', 'addresses']);

  const lastSelectedAddress = useLastSelectedAddress();

  const {
    data: sections,
    isFetching,
    error,
    refetch,
  } = useHomeSections(lastSelectedAddress?.id);


  const renderContent = () => {
    if (isFetching) {
      return <>
        <Header />
        <HomePageSkeleton />
      </>
    }

    if (error) {
      return (
        <View style={styles.errorBox}>
          <Text style={[styles.errorText, { color: colors.mutedForeground }]}>{parseApiError(error).message}</Text>
          <Pressable style={[styles.retryButton, { backgroundColor: colors.primary }]} onPress={() => void refetch()}>
            <Text style={[styles.retryLabel, { color: colors.primaryForeground }]}>{t('general:actions.retry')}</Text>
          </Pressable>
        </View>
      );
    }

    return (
      <FlatList
        data={sections}
        renderItem={({ item }) => <SectionRenderer section={item} />}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<Header />}
        // refreshControl={
        //   <RefreshControl
        //     refreshing={isFetching}
        //     onRefresh={() => void refetch()}
        //     tintColor={colors.primary}
        //     progressBackgroundColor={colors.background}
        //     progressViewOffset={insets.top}
        //   />
        // }
        ListEmptyComponent={<Text style={[styles.emptyText, { color: colors.mutedForeground }]}>{t('general:empty.nothing_to_show')}</Text>}
      />
    );
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top, backgroundColor: colors.background }]}>
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  errorBox: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing['2xl'],
    alignItems: 'center',
  },
  errorText: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  retryButton: {
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.tight,
    borderRadius: BorderRadius.full,
  },
  retryLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: Spacing.xl,
    fontSize: 15,
    paddingHorizontal: Spacing.lg,
  },
}
);

// import { useState, useEffect } from 'react';
// import { Text, View, Button, Platform } from 'react-native';
// import * as Notifications from 'expo-notifications';
// import Constants from 'expo-constants';


// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldPlaySound: true,
//     shouldSetBadge: true,
//     shouldShowBanner: true,
//     shouldShowList: true,
//   }),
// });



// async function sendPushNotification(expoPushToken: string) {
//   const message = {
//     to: expoPushToken,
//     sound: 'default',
//     title: 'Original Title',
//     body: 'And here is the body!',
//     data: { someData: 'goes here' },
//   };

//   const response = await fetch('https://exp.host/--/api/v2/push/send', {
//     method: 'POST',
//     headers: {
//       Accept: 'application/json',
//       'Accept-encoding': 'gzip, deflate',
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(message),
//   });

//   // The push "ticket" tells us if Expo accepted the message and, if not, why
//   // (e.g. DeviceNotRegistered, InvalidCredentials -> FCM V1 key not uploaded).
//   // const ticket = await response.json();
//   // console.log('Push ticket:', JSON.stringify(ticket, null, 2));
//   // alert(`Push ticket: ${JSON.stringify(ticket?.data ?? ticket)}`);
// }


// function handleRegistrationError(errorMessage: string) {
//   alert(errorMessage);
//   throw new Error(errorMessage);
// }

// async function registerForPushNotificationsAsync() {
//   if (Platform.OS === 'android') {
//     await Notifications.setNotificationChannelAsync('default', {
//       name: 'default',
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: '#FF231F7C',
//     });
//   }

//   const { status: existingStatus } = await Notifications.getPermissionsAsync();
//   let finalStatus = existingStatus;
//   if (existingStatus !== 'granted') {
//     const { status } = await Notifications.requestPermissionsAsync();
//     finalStatus = status;
//   }
//   if (finalStatus !== 'granted') {
//     handleRegistrationError('Permission not granted to get push token for push notification!');
//     return;
//   }
//   const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
//   if (!projectId) {
//     handleRegistrationError('Project ID not found');
//   }
//   try {
//     const pushTokenString = (
//       await Notifications.getExpoPushTokenAsync({
//         projectId,
//       })
//     ).data;
//     console.log(pushTokenString);
//     return pushTokenString;
//   } catch (e: unknown) {
//     handleRegistrationError(`${e}`);
//   }
// }

// export default function HomeScreen() {
//   const [expoPushToken, setExpoPushToken] = useState('');
//   const [notification, setNotification] = useState<Notifications.Notification | undefined>(
//     undefined
//   );

//   useEffect(() => {
//     registerForPushNotificationsAsync()
//       .then(token => setExpoPushToken(token ?? ''))
//       .catch((error: any) => setExpoPushToken(`${error}`));

//     const notificationListener = Notifications.addNotificationReceivedListener(notification => {
//       setNotification(notification);
//     });

//     const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
//       console.log(response);
//     });

//     return () => {
//       notificationListener.remove();
//       responseListener.remove();
//     };
//   }, []);

//   return (
//     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-around' }}>
//       <Text>Your Expo push token: {expoPushToken}</Text>
//       <View style={{ alignItems: 'center', justifyContent: 'center' }}>
//         <Text>Title: {notification && notification.request.content.title} </Text>
//         <Text>Body: {notification && notification.request.content.body}</Text>
//         <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
//       </View>
//       <Button
//         title="Press to Send Notification"
//         onPress={async () => {
//           await sendPushNotification(expoPushToken);
//         }}
//       />
//     </View>
//   );
// }
