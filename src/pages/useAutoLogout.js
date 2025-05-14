import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useAutoLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let timer;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        // Supprimer les données utilisateur
        localStorage.clear();
        navigate('/'); // Redirection vers la page de login
      }, 10 * 60 * 1000); // 5 minutes
    };

    const events = ['mousemove', 'keydown', 'click', 'scroll'];

    events.forEach(event =>
      window.addEventListener(event, resetTimer)
    );

    resetTimer(); // Démarrer le timer au chargement

    return () => {
      events.forEach(event =>
        window.removeEventListener(event, resetTimer)
      );
      clearTimeout(timer);
    };
  }, [navigate]);
};

export default useAutoLogout;
