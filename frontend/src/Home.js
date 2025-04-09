import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();  // Це функція, яка дозволяє перейти на іншу сторінку

  const goToHome2 = () => {
    navigate('/home2');  // Це викликається, коли натискаєш кнопку
  };

  return (
    <div>
      <button onClick={goToHome2}>Перейти на Home2</button>
    </div>
  );
}

export default Home;
