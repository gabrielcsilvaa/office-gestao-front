import React from 'react';

// Importe suas imagens de boneco masculino e feminino
// Certifique-se de ter essas imagens em seu projeto (ex: na pasta public ou src/assets)
// Exemplo:
// import MaleIcon from './assets/male-icon.png';
// import FemaleIcon from './assets/female-icon.png';

interface GraficoGeneroProps {
  masculinoPercentual?: number;
  femininoPercentual?: number;
}

const GraficoGenero: React.FC<GraficoGeneroProps> = ({
  masculinoPercentual = 63, // Valor padrão, você pode passar via props
  femininoPercentual = 37,  // Valor padrão, você pode passar via props
}) => {
  return (
    <div style={{
      width: '100%',
      maxWidth: '300px', // Limita a largura para ficar parecido com a imagem
      height: '250px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '10px',
      backgroundColor: '#f9f9f9', // Cor de fundo similar à da imagem
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h3 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
        Colaboradores por Gênero
      </h3>
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        width: '100%',
        alignItems: 'flex-end', // Alinha a base dos bonecos
        marginTop: '20px'
      }}>
        {/* Boneco Masculino */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '5px'
        }}>
          <span style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#007bff' }}>
            {masculinoPercentual.toFixed(2)}%
          </span>
          {/* Substitua './male-icon.png' pela URL ou importação real do seu ícone */}
          {/* Você pode usar um SVG inline ou um ícone de biblioteca se preferir */}
          <img
            src="https://via.placeholder.com/80x150/007bff/FFFFFF?text=M" // Placeholder: M de Male, cor azul
            alt="Ícone Masculino"
            style={{ height: '100px', width: 'auto' }}
          />
        </div>

        {/* Linha divisória (opcional, se quiser simular a da imagem) */}
        <div style={{
          width: '1px',
          backgroundColor: '#ccc',
          height: '80%', // Ajuste conforme a altura dos bonecos
          alignSelf: 'center'
        }}></div>

        {/* Boneca Feminina */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '5px'
        }}>
          <span style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#888' }}>
            {femininoPercentual.toFixed(2)}%
          </span>
          {/* Substitua './female-icon.png' pela URL ou importação real do seu ícone */}
          {/* Você pode usar um SVG inline ou um ícone de biblioteca se preferir */}
          <img
            src="https://via.placeholder.com/80x150/CCCCCC/FFFFFF?text=F" // Placeholder: F de Female, cor cinza
            alt="Ícone Feminino"
            style={{ height: '100px', width: 'auto' }}
          />
        </div>
      </div>
    </div>
  );
};

export default GraficoGenero;