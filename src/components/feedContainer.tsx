import { useState, useEffect } from 'react';
import {
  IonApp,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonInput,
  IonLabel,
  IonModal,
  IonFooter,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonAlert,
  IonText,
  IonSpinner
} from '@ionic/react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../utils/supabaseClient';

interface Post {
  post_id: string;
  user_id: number;
  username: string;
  post_content: string;
  post_created_at: string;
  post_updated_at: string;
}

const FeedContainer = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [postContent, setPostContent] = useState('');
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<number | null>(null); // 🔥 Separate userId for DB
  const [username, setUsername] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: authData } = await supabase.auth.getUser();
      if (authData?.user?.email?.endsWith('@nbsc.edu.ph')) {
        setUser(authData.user);
        const { data: userData, error } = await supabase
          .from('users')
          .select('user_id, username')
          .eq('user_email', authData.user.email)
          .single();
        if (!error && userData) {
          setUserId(userData.user_id); // 🔥 Store DB user_id separately
          setUsername(userData.username);
        }
      }
    };

    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('post_created_at', { ascending: false });
      if (!error && data) {
        setPosts(data as Post[]);
      }
    };

    const initialize = async () => {
      await fetchUser();
      await fetchPosts();
      setLoading(false);
    };

    initialize();
  }, []);

  const createPost = async () => {
    console.log("Creating post...");
    console.log("Post Content:", postContent);
    console.log("UserId:", userId);
    console.log("Username:", username);

    if (!postContent || !userId || !username) {
      console.warn("Missing input! Cannot create post.");
      return;
    }

    const { data, error } = await supabase
      .from('posts')
      .insert([
        {
          post_content: postContent,
          user_id: userId,
          username
        }
      ])
      .select('*');

    if (error) {
      console.error("Supabase insert error:", error.message);
      return;
    }

    if (data && data.length > 0) {
      console.log("Post successfully created:", data[0]);
      setPosts([data[0] as Post, ...posts]);
      setPostContent('');
    }
  };

  const deletePost = async (post_id: string) => {
    const { error } = await supabase.from('posts').delete().match({ post_id });
    if (!error) {
      setPosts(posts.filter(post => post.post_id !== post_id));
    }
  };

  const startEditingPost = (post: Post) => {
    setEditingPost(post);
    setPostContent(post.post_content);
    setIsModalOpen(true);
  };

  const savePost = async () => {
    if (!postContent || !editingPost) return;

    const { data, error } = await supabase
      .from('posts')
      .update({ post_content: postContent })
      .match({ post_id: editingPost.post_id })
      .select('*');

    if (!error && data && data.length > 0) {
      const updatedPost = data[0] as Post;
      setPosts(posts.map(post => (post.post_id === updatedPost.post_id ? updatedPost : post)));
      setPostContent('');
      setEditingPost(null);
      setIsModalOpen(false);
      setIsAlertOpen(true);
    }
  };

  return (
    <IonApp>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Posts</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          {loading ? (
            <IonSpinner name="crescent" />
          ) : user ? (
            <>
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Create Post</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonInput
                    value={postContent}
                    onIonChange={e => setPostContent(e.detail.value!)}
                    placeholder="Write a post..."
                  />
                  <IonButton expand="full" onClick={createPost}>
                    Post
                  </IonButton>
                </IonCardContent>
              </IonCard>

              {posts.map(post => (
                <IonCard key={post.post_id}>
                  <IonCardHeader>
                    <IonCardTitle>{post.username}</IonCardTitle>
                    <IonCardSubtitle>{new Date(post.post_created_at).toLocaleString()}</IonCardSubtitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonText color="secondary">
                      <h2>{post.post_content}</h2>
                    </IonText>
                  </IonCardContent>
                  <IonFooter>
                    <IonButton fill="clear" onClick={() => startEditingPost(post)}>
                      Edit
                    </IonButton>
                    <IonButton fill="clear" color="danger" onClick={() => deletePost(post.post_id)}>
                      Delete
                    </IonButton>
                  </IonFooter>
                </IonCard>
              ))}
            </>
          ) : (
            <IonLabel>Unauthorized or loading...</IonLabel>
          )}
        </IonContent>

        <IonModal isOpen={isModalOpen} onDidDismiss={() => setIsModalOpen(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Edit Post</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonInput
              value={postContent}
              onIonChange={e => setPostContent(e.detail.value!)}
              placeholder="Edit your post..."
            />
          </IonContent>
          <IonFooter>
            <IonButton expand="full" onClick={savePost}>
              Save
            </IonButton>
            <IonButton expand="full" onClick={() => setIsModalOpen(false)}>
              Cancel
            </IonButton>
          </IonFooter>
        </IonModal>

        <IonAlert
          isOpen={isAlertOpen}
          onDidDismiss={() => setIsAlertOpen(false)}
          header="Success"
          message="Post updated successfully!"
          buttons={['OK']}
        />
      </IonPage>
    </IonApp>
  );
};

export default FeedContainer;
