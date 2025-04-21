import React, { useEffect, useState } from "react";
import ScoreBoard from "./ScoreBoard";

const CardGrid = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [scores, setScores] = useState(0);
  const [bestScores, setBestScores] = useState(0);
  const [gameOver, setGameOver] = useState(false); // Add gameOver state

  const pokemonUrls = [
    "https://pokeapi.co/api/v2/pokemon/1",
    "https://pokeapi.co/api/v2/pokemon/4",
    "https://pokeapi.co/api/v2/pokemon/7",
    "https://pokeapi.co/api/v2/pokemon/10",
    "https://pokeapi.co/api/v2/pokemon/25",
    "https://pokeapi.co/api/v2/pokemon/5",
    "https://pokeapi.co/api/v2/pokemon/11",
    "https://pokeapi.co/api/v2/pokemon/3",
    "https://pokeapi.co/api/v2/pokemon/9",
  ];

  useEffect(() => {
    const fetchAllPokemon = async () => {
      try {
        const responses = await Promise.all(
          pokemonUrls.map((url) => fetch(url).then((res) => res.json()))
        );

        const simplified = responses.map((p) => ({
          name: p.name,
          image: p.sprites.front_default,
          clicked: false,
        }));

        setPokemonList(simplified);
      } catch (err) {
        console.error("Error fetching Pokémon:", err);
      }
    };

    fetchAllPokemon();
  }, []);

  // Shuffle function
  const shuffleArray = (arr) => {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleClick = (name) => {
    // If the game is over, restart the game when a card is clicked
    if (gameOver) {
      setGameOver(false); // Reset game over state
      setScores(0); // Reset score
      const resetList = pokemonList.map((p) => ({ ...p, clicked: false }));
      setPokemonList(shuffleArray(resetList)); // Shuffle cards
    }

    const clickedPokemon = pokemonList.find((p) => p.name === name);

    if (clickedPokemon.clicked) {
      // Game over if the same Pokémon is clicked twice
      setGameOver(true);
      setScores(0);

      // Reset all "clicked" states and reshuffle
      const resetList = pokemonList.map((p) => ({ ...p, clicked: false }));
      setPokemonList(shuffleArray(resetList));
      return;
    }

    // Otherwise, update clicked state and shuffle the list
    const updatedList = pokemonList.map((p) => {
      if (p.name === name) {
        return { ...p, clicked: true };
      }
      return p;
    });

    setPokemonList(shuffleArray(updatedList));

    // Update score
    setScores((prevScores) => {
      const newScores = prevScores + 1;
      if (newScores > bestScores) {
        setBestScores(newScores);
      }
      return newScores;
    });
  };

  return (
    <>
      <ScoreBoard scores={scores} bestScores={bestScores} />

      {gameOver && (
        <div className="game-over-notification">
          <h2>Game Over!</h2>
          <p>Click a Pokémon to restart the game.</p>
        </div>
      )}

      <div className="container">
        {pokemonList.map((p, index) => (
          <div key={index} className="card" onClick={() => handleClick(p.name)}>
            <img src={p.image} alt={p.name} className="image" />
            <h4>{p.name.toUpperCase()}</h4>
          </div>
        ))}
      </div>
    </>
  );
};

export default CardGrid;
