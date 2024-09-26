import React, { useState, useEffect } from "react";

import "./App.css";

const App = () => {
    const [time, setTime] = useState(0);
    const [points, setPoints] = useState(3);
    const [circles, setCircles] = useState([]);
    const [gameOver, setGameOver] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    const [gameActive, setGameActive] = useState(false);
    const [gameFinished, setGameFinished] = useState(false);
    const [lastClickedIndex, setLastClickedIndex] = useState(-1);

    // Tạo hình tròn dựa trên điểm khi trò chơi bắt đầu
    useEffect(() => {
        if (gameActive) {
            const initialCircles = Array.from(
                { length: points },
                (_, index) => {
                    const circleSize = 45;
                    const randomTop = Math.floor(
                        Math.random() * (100 - circleSize / 5)
                    );
                    const randomLeft = Math.floor(
                        Math.random() * (100 - circleSize / 5)
                    );

                    return {
                        id: index + 1,
                        clicked: false,
                        hidden: false,
                        style: {
                            position: "absolute",
                            top: `${randomTop}%`,
                            left: `${randomLeft}%`,
                        },
                    };
                }
            );

            setCircles(initialCircles);
        }
    }, [gameActive]);

    const startGame = () => {
        setGameActive(true);
        setTime(0);
        setGameFinished(false);
        setLastClickedIndex(-1);
        setGameOver(false);

        const initialCircles = Array.from({ length: points }, (_, index) => {
            const circleSize = 45;
            const randomTop = Math.floor(
                Math.random() * (100 - circleSize / 5)
            );
            const randomLeft = Math.floor(
                Math.random() * (100 - circleSize / 5)
            );

            return {
                id: index + 1,
                clicked: false,
                hidden: false,
                style: {
                    position: "absolute",
                    top: `${randomTop}%`,
                    left: `${randomLeft}%`,
                },
            };
        });

        setCircles(initialCircles);
    };

    // Xử lý click trên hình tròn
    const handleCircleClick = (id) => {
        const clickedIndex = id - 1;

        // Kiểm tra thứ tự click
        if (clickedIndex !== lastClickedIndex + 1) {
            setGameOver(true);
            setGameFinished(true);
            return;
        }

        setLastClickedIndex(clickedIndex);
        setCircles((prevCircles) =>
            prevCircles.map((circle) =>
                circle.id === id ? { ...circle, clicked: true } : circle
            )
        );

        // Ẩn hình tròn sau 1 giây
        setTimeout(() => {
            setCircles((prevCircles) =>
                prevCircles.map((circle) =>
                    circle.id === id
                        ? { ...circle, clicked: true, hidden: true }
                        : circle
                )
            );
        }, 1000);
    };

    // Theo dõi thời gian khi trò chơi đang hoạt động
    useEffect(() => {
        let timer;
        if (gameActive && !gameFinished) {
            timer = setInterval(() => {
                setTime((prevTime) => prevTime + 0.1);
            }, 100);
        }
        return () => clearInterval(timer);
    }, [gameActive, gameFinished]);

    // Kiểm tra xem tất cả hình tròn đã được click chưa
    useEffect(() => {
        if (circles.length > 0 && circles.every((circle) => circle.clicked)) {
            setGameFinished(true);
            setGameActive(true);
        }
    }, [circles]);

    // Xử lý click nút "Play" hoặc "Restart"
    const handlePlayClick = () => {
        setHasStarted(true);
        startGame();
    };

    // Xử lý logic Restart
    const handleRestart = () => {
        setGameActive(false);
        setTime(0);
        setLastClickedIndex(-1);
        setGameOver(false);
        setGameFinished(false);

        // Tạo lại các hình tròn mới dựa trên giá trị points hiện tại
        const newCircles = Array.from({ length: points }, (_, index) => {
            const circleSize = 45;
            const randomTop = Math.floor(
                Math.random() * (100 - circleSize / 5)
            );
            const randomLeft = Math.floor(
                Math.random() * (100 - circleSize / 5)
            );

            return {
                id: index + 1,
                clicked: false,
                hidden: false,
                style: {
                    position: "absolute",
                    top: `${randomTop}%`,
                    left: `${randomLeft}%`,
                },
            };
        });

        setCircles(newCircles);
        startGame();
    };

    return (
        <div className="app">
            <h1>
                {gameFinished ? (
                    gameOver ? (
                        <span className="game-over">GAME OVER</span>
                    ) : (
                        <span className="all-cleared">ALL CLEARED</span>
                    )
                ) : (
                    "LET'S PLAY"
                )}
            </h1>

            <div className="game-header">
                <div className="game-header-input">
                    <label>Points: </label>
                    <input
                        type="text"
                        value={points}
                        onChange={(e) => setPoints(Number(e.target.value))}
                    />
                </div>
                <div className="game-header-time">
                    <span>Time: </span>
                    {time.toFixed(1)}s
                </div>
            </div>
            {!hasStarted ? (
                <button onClick={handlePlayClick}>Play</button>
            ) : (
                <div>
                    <button onClick={handleRestart}>Restart</button>

                    <div className="game-board">
                        {!gameFinished &&
                            circles.map(
                                (circle) =>
                                    !circle.hidden && (
                                        <div
                                            key={circle.id}
                                            className={`circle ${
                                                circle.clicked ? "clicked" : ""
                                            }`}
                                            style={circle.style}
                                            onClick={() =>
                                                handleCircleClick(circle.id)
                                            }
                                        >
                                            {circle.id}
                                        </div>
                                    )
                            )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;
