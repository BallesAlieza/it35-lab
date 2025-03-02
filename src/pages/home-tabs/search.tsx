import { 
    IonButtons,
      IonContent, 
      IonHeader, 
      IonMenuButton, 
      IonPage, 
      IonTitle, 
      IonToolbar 
  } from '@ionic/react';
  import React from 'react';
import { IonSearchbar } from '@ionic/react';
  
  const search: React.FC = () => {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
          <>
      <IonSearchbar placeholder="Default"></IonSearchbar>
      <IonSearchbar color="primary" placeholder="Primary"></IonSearchbar>
      <IonSearchbar color="secondary" placeholder="Secondary"></IonSearchbar>
      <IonSearchbar color="tertiary" placeholder="Tertiary"></IonSearchbar>
      <IonSearchbar color="success" placeholder="Success"></IonSearchbar>
      <IonSearchbar color="warning" placeholder="Warning"></IonSearchbar>
      <IonSearchbar color="danger" placeholder="Danger"></IonSearchbar>
      <IonSearchbar color="light" placeholder="Light"></IonSearchbar>
      <IonSearchbar color="medium" placeholder="Medium"></IonSearchbar>
      <IonSearchbar color="dark" placeholder="Dark"></IonSearchbar>
    </>
            <IonButtons slot='start'>
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>search</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
          }}
        >
          Search
        </div>
        </IonContent>
      </IonPage>
    );
  };
  
  export default search;