// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { Platform, Alert, Linking } from 'react-native';
// import { check, request, PERMISSIONS, PermissionStatus } from 'react-native-permissions';
// // import PushNotification from 'react-native-push-notification';

// type NotificationContextData = {
//     notificationPermission: PermissionStatus | null;
//     requestNotificationPermission: () => Promise<void>;
//     checkNotificationPermission: () => Promise<void>;
//     openSettings: () => Promise<void>;
// };

// const NotificationsContext = createContext<NotificationContextData>({} as NotificationContextData);

// export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//     const [notificationPermission, setNotificationPermission] = useState<PermissionStatus | null>(null);

//     const checkNotificationPermission = async () => {
//         try {
//           let permissionStatus: PermissionStatus;
          
//           if (Platform.OS === 'android') {
//             permissionStatus = await check(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
//           } else {
//             permissionStatus = await check(PERMISSIONS.IOS.REMOTE_NOTIFICATIONS);
//           }
          
//           setNotificationPermission(permissionStatus);
//           return permissionStatus;
//         } catch (error) {
//           console.error('Error checking notification permission:', error);
//           return 'unavailable' as PermissionStatus;
//         }
//     };

//     const requestNotificationPermission = async () => {
//         try {
//           let permissionStatus: PermissionStatus;
          
//           if (Platform.OS === 'android') {
//             permissionStatus = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
//           } else {
//             permissionStatus = await request(PERMISSIONS.IOS.REMOTE_NOTIFICATIONS);
//           }
          
//           setNotificationPermission(permissionStatus);
          
//           if (permissionStatus === 'granted') {
//             // configurePushNotifications();
//           }
          
//           return permissionStatus;
//         } catch (error) {
//           console.error('Error requesting notification permission:', error);
//           return 'unavailable' as PermissionStatus;
//         }
//       };

//     //   const configurePushNotifications = () => {
//     //     PushNotification.configure({
//     //       onRegister: (token) => {
//     //         console.log('TOKEN:', token);
//     //         // Aqui você pode enviar o token para seu backend
//     //       },
//     //       onNotification: (notification) => {
//     //         console.log('NOTIFICATION:', notification);
//     //         // Processar a notificação recebida
//     //       },
//     //       permissions: {
//     //         alert: true,
//     //         badge: true,
//     //         sound: true,
//     //       },
//     //       popInitialNotification: true,
//     //       requestPermissions: false, // Nós vamos gerenciar as permissões manualmente
//     //     });
//     //   };

//     const openSettings = async () => {
//         try {
//           await Linking.openSettings();
//           // Quando volta das configurações, verifica novamente o status
//           await checkNotificationPermission();
//         } catch (error) {
//           console.error('Error opening settings:', error);
//         }
//     };

//     const showPermissionAlert = () => {
//         Alert.alert(
//           'Permissão de Notificações',
//           'Para receber alertas importantes, por favor habilite as notificações.',
//           [
//             {
//               text: 'Agora não',
//               style: 'cancel',
//             },
//             {
//               text: 'Habilitar',
//               onPress: requestNotificationPermission,
//             },
//             {
//               text: 'Abrir Configurações',
//               onPress: openSettings,
//               style: 'destructive',
//             },
//           ]
//         );
//       };
    
//       useEffect(() => {
//         // Verifica a permissão quando o provider é montado
//         checkNotificationPermission();
//       }, []);
    
//       return (
//         <NotificationsContext.Provider
//           value={{
//             notificationPermission,
//             requestNotificationPermission,
//             checkNotificationPermission,
//             openSettings,
//           }}
//         >
//           {children}
//         </NotificationsContext.Provider>
//       );
//     };
    
//     export const useNotifications = () => {
//       const context = useContext(NotificationsContext);
//       if (!context) {
//         throw new Error('useNotifications must be used within a NotificationsProvider');
//       }
//       return context;
//     };
// }