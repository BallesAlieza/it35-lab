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
  import { IonImg } from '@ionic/react';

  const feed: React.FC = () => {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
          <IonImg
      src="https://docs-demo.ionic.io/assets/madison.jpg"
      alt="The Wisconsin State Capitol building in Madison, WI at night"
    ></IonImg>
            <IonButtons slot='start'>
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle></IonTitle>
          </IonToolbar>
          <IonImg
      src="https://docs-demo.ionic.io/assets/madison.jpg"
      alt="The Wisconsin State Capitol building in Madison, WI at night"
    ></IonImg>
        </IonHeader>
        <IonContent fullscreen>
        <div
          style={{
            display: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
          }}
        >
          Feed
        </div>
        </IonContent>
      </IonPage>
    );
  };
  
  export default feed;