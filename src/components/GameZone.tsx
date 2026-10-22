import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Gamepad2,
  Trophy,
  RotateCcw,
  Sparkles,
  Volume2,
  CheckCircle2,
  Star,
  Play,
  ArrowRight,
  Shuffle,
  Compass,
} from 'lucide-react';
import { GradeLevel } from '../types';
import { speakEnglish } from '../utils/speech';
import { playCorrectChime, playStarDing, playTryAgainSound, playVictoryFanfare } from '../utils/audioEffects';

interface GameZoneProps {
  gradeLevel: GradeLevel;
  onAddStars: (stars: number) => void;
}

export const GameZone: React.FC<GameZoneProps> = ({ gradeLevel, onAddStars }) => {
  const [activeGame, setActiveGame] = useState<number>(1);
  const [gameScore, setGameScore] = useState<number>(0);

  // GAME 1: Word Match State
  const [matchPairs, setMatchPairs] = useState([
    { id: '1', word: 'Apple', icon: '🍎', matched: false },
    { id: '2', word: 'Cat', icon: '🐱', matched: false },
    { id: '3', word: 'Book', icon: '📖', matched: false },
    { id: '4', word: 'Car', icon: '🚗', matched: false },
  ]);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

  // GAME 2: Picture Quiz State
  const [quizRound, setQuizRound] = useState(0);
  const quizItems = [
    { question: 'What animal is this?', icon: '🐶', options: ['Cat', 'Dog', 'Bird', 'Fish'], correct: 1 },
    { question: 'What fruit is this?', icon: '🍌', options: ['Banana', 'Apple', 'Orange', 'Grape'], correct: 0 },
    { question: 'What vehicle is this?', icon: '✈️', options: ['Car', 'Train', 'Airplane', 'Boat'], correct: 2 },
  ];
  const [quizSelected, setQuizSelected] = useState<number | null>(null);

  // GAME 3: Listen & Choose State
  const [listenRound, setListenRound] = useState(0);
  const listenItems = [
    { audio: 'Hello friend', options: ['Hello friend', 'Goodbye teacher', 'Good night baby', 'Thank you mom'], correct: 0 },
    { audio: 'I love milk', options: ['I eat bread', 'I love milk', 'I drink water', 'I like apples'], correct: 1 },
  ];
  const [listenSelected, setListenSelected] = useState<number | null>(null);

  // GAME 4: Magic Wheel State
  const wheelQuestions = [
    'Nói 3 màu sắc bằng Tiếng Anh! 🎨',
    'Kể tên 3 con vật nuôi trong nhà! 🐾',
    'Chào bạn Buddy bằng 1 câu Tiếng Anh! 👋',
    'Đếm từ số 1 đến số 10 bằng Tiếng Anh! 🔢',
    'Nói tên món ăn hoặc đồ uống con thích nhất! 🍎',
    'Hát 1 đoạn bài hát Tiếng Anh mà con biết! 🎵',
  ];
  const [spinning, setSpinning] = useState(false);
  const [wheelResult, setWheelResult] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);

  // GAME 5: Word Puzzle State (Arrange words into meaningful English sentence)
  const [puzzleRound, setPuzzleRound] = useState(0);
  const puzzleItems = [
    { target: 'This is my friend', scrambled: ['friend', 'is', 'This', 'my'], correct: ['This', 'is', 'my', 'friend'] },
    { target: 'I have a red ball', scrambled: ['red', 'I', 'ball', 'have', 'a'], correct: ['I', 'have', 'a', 'red', 'ball'] },
  ];
  const [currentSentenceSlots, setCurrentSentenceSlots] = useState<string[]>([]);
  const [remainingWords, setRemainingWords] = useState<string[]>(puzzleItems[0].scrambled);

  // GAME 6: English Adventure Board Game State
  const [adventureStep, setAdventureStep] = useState(0);
  const boardSteps = [
    { step: 0, title: 'Khởi hành', question: 'Say "Hello" in English!', answer: 'Hello' },
    { step: 1, title: 'Đảo Rừng Xanh', question: 'Con khỉ thích ăn quả gì? (Banana/Apple)', answer: 'Banana' },
    { step: 2, title: 'Thung Lũng Cầu Vồng', question: 'Màu của bầu trời là màu gì? (Blue/Red)', answer: 'Blue' },
    { step: 3, title: 'Lâu Đài Trí Tuệ', question: 'Điền từ: "I ____ a student." (am/is)', answer: 'am' },
    { step: 4, title: 'Đích Chạm Sao Vàng', question: 'Tuyệt đỉnh! Con đã về đích!', answer: 'Finish' },
  ];
  const [adventureChoice, setAdventureChoice] = useState<string | null>(null);

  // Handlers for GAME 1: Word Match
  const handleSelectWord = (word: string) => {
    setSelectedWord(word);
    checkMatch(word, selectedIcon);
  };
  const handleSelectIcon = (icon: string) => {
    setSelectedIcon(icon);
    checkMatch(selectedWord, icon);
  };
  const checkMatch = (w: string | null, i: string | null) => {
    if (!w || !i) return;
    const pair = matchPairs.find((p) => p.word === w && p.icon === i);
    if (pair) {
      playCorrectChime();
      playStarDing();
      setMatchPairs((prev) => prev.map((p) => (p.id === pair.id ? { ...p, matched: true } : p)));
      setGameScore((prev) => prev + 10);
      onAddStars(1);
    } else {
      playTryAgainSound();
    }
    setSelectedWord(null);
    setSelectedIcon(null);
  };

  // Handlers for GAME 4: Magic Wheel
  const spinMagicWheel = () => {
    if (spinning) return;
    setSpinning(true);
    setWheelResult(null);

    const randomDeg = Math.floor(Math.random() * 360) + 1440; // At least 4 full spins
    const finalRot = rotation + randomDeg;
    setRotation(finalRot);

    setTimeout(() => {
      setSpinning(false);
      const index = Math.floor(Math.random() * wheelQuestions.length);
      setWheelResult(wheelQuestions[index]);
      playCorrectChime();
      playStarDing();
      onAddStars(2);
      try {
        confetti({ particleCount: 60, spread: 50, origin: { y: 0.7 } });
      } catch (e) {}
    }, 3000);
  };

  // Handlers for GAME 5: Word Puzzle
  const handleAddSlot = (word: string, index: number) => {
    setCurrentSentenceSlots([...currentSentenceSlots, word]);
    const nextRem = [...remainingWords];
    nextRem.splice(index, 1);
    setRemainingWords(nextRem);

    // If all placed, check correctness
    if (nextRem.length === 0) {
      const fullSentence = [...currentSentenceSlots, word].join(' ');
      const target = puzzleItems[puzzleRound].target;
      if (fullSentence === target) {
        playCorrectChime();
        playStarDing();
        onAddStars(2);
        setGameScore((prev) => prev + 20);
      } else {
        playTryAgainSound();
      }
    }
  };

  const handleResetPuzzle = () => {
    setCurrentSentenceSlots([]);
    setRemainingWords(puzzleItems[puzzleRound].scrambled);
  };

  // Handlers for GAME 6: Adventure Step
  const handleAdventureAnswer = (choice: string) => {
    const target = boardSteps[adventureStep].answer;
    if (choice.toLowerCase().includes(target.toLowerCase())) {
      playCorrectChime();
      playStarDing();
      setAdventureStep((prev) => Math.min(prev + 1, boardSteps.length - 1));
      onAddStars(1);
      setGameScore((prev) => prev + 15);
      if (adventureStep === boardSteps.length - 2) {
        playVictoryFanfare();
      }
    } else {
      playTryAgainSound();
    }
    setAdventureChoice(null);
  };

  const gameNav = [
    { id: 1, title: 'Word Match', icon: '🧩', desc: 'Nối từ với hình' },
    { id: 2, title: 'Picture Quiz', icon: '🎯', desc: 'Đố vui qua tranh' },
    { id: 3, title: 'Listen & Choose', icon: '🎧', desc: 'Nghe và chọn từ' },
    { id: 4, title: 'Magic Wheel', icon: '🎡', desc: 'Vòng quay kỳ diệu' },
    { id: 5, title: 'Word Puzzle', icon: '🔤', desc: 'Xếp câu thông minh' },
    { id: 6, title: 'Adventure', icon: '🗺️', desc: 'Thám hiểm giải đố' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
            Chức năng 6: Game Zone
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-heading mt-1">
            ENGLISH GAME ZONE 🎮
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1">
            Học mà chơi, chơi mà học! Vừa ghi nhớ sâu từ vựng vừa thu thập sao vàng.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
          <Trophy className="w-5 h-5 text-amber-300" />
          <div className="text-left text-xs font-bold">
            <span className="text-emerald-100 block text-[10px]">Điểm trò chơi:</span>
            <span className="text-white text-base font-black">{gameScore} pts</span>
          </div>
        </div>
      </div>

      {/* 6 Game Tabs Navigation */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {gameNav.map((g) => (
          <button
            key={g.id}
            onClick={() => setActiveGame(g.id)}
            className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
              activeGame === g.id
                ? 'bg-emerald-500 text-white border-emerald-500 shadow-md transform -translate-y-0.5'
                : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'
            }`}
          >
            <span className="text-2xl select-none mb-1">{g.icon}</span>
            <div>
              <h4 className="font-bold text-xs sm:text-sm leading-tight">{g.title}</h4>
              <p
                className={`text-[10px] mt-0.5 ${
                  activeGame === g.id ? 'text-emerald-100' : 'text-slate-400'
                }`}
              >
                {g.desc}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* ==================== GAME 1: WORD MATCH ==================== */}
      {activeGame === 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl space-y-6">
          <div className="space-y-1 text-center">
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              Trò chơi 1: Nối từ với hình tương ứng
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-800">Word Match Challenge</h3>
            <p className="text-xs text-slate-500">
              Chọn một từ Tiếng Anh ở bên trái, sau đó chọn một hình minh họa ở bên phải để ghép đôi.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 max-w-lg mx-auto">
            {/* Words column */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block text-center">
                Từ Tiếng Anh
              </span>
              {matchPairs.map((pair) => (
                <button
                  key={pair.id}
                  disabled={pair.matched}
                  onClick={() => handleSelectWord(pair.word)}
                  className={`w-full p-4 rounded-2xl border-2 font-bold text-sm transition-all shadow-xs ${
                    pair.matched
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-600 line-through opacity-60'
                      : selectedWord === pair.word
                      ? 'bg-emerald-500 text-white border-emerald-500 ring-2 ring-emerald-300'
                      : 'bg-white border-slate-200 hover:border-emerald-400 text-slate-800'
                  }`}
                >
                  {pair.word}
                </button>
              ))}
            </div>

            {/* Icons column */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block text-center">
                Hình minh họa
              </span>
              {/* Shuffled display */}
              {[...matchPairs]
                .sort((a, b) => b.id.localeCompare(a.id))
                .map((pair) => (
                  <button
                    key={pair.id}
                    disabled={pair.matched}
                    onClick={() => handleSelectIcon(pair.icon)}
                    className={`w-full p-4 rounded-2xl border-2 font-bold text-2xl transition-all shadow-xs ${
                      pair.matched
                        ? 'bg-emerald-50 border-emerald-300 opacity-60'
                        : selectedIcon === pair.icon
                        ? 'bg-emerald-500 text-white border-emerald-500 ring-2 ring-emerald-300'
                        : 'bg-white border-slate-200 hover:border-emerald-400'
                    }`}
                  >
                    {pair.icon}
                  </button>
                ))}
            </div>
          </div>

          {matchPairs.every((p) => p.matched) && (
            <div className="p-4 bg-emerald-50 rounded-2xl text-center space-y-2 animate-fadeIn">
              <span className="text-2xl">🎉</span>
              <p className="font-bold text-emerald-800 text-sm">
                Xuất sắc! Con đã ghép đúng toàn bộ các cặp từ!
              </p>
              <button
                onClick={() =>
                  setMatchPairs([
                    { id: '1', word: 'Dog', icon: '🐶', matched: false },
                    { id: '2', word: 'Apple', icon: '🍎', matched: false },
                    { id: '3', word: 'School', icon: '🏫', matched: false },
                    { id: '4', word: 'Pencil', icon: '✏️', matched: false },
                  ])
                }
                className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold"
              >
                Chơi màn tiếp theo
              </button>
            </div>
          )}
        </div>
      )}

      {/* ==================== GAME 2: PICTURE QUIZ ==================== */}
      {activeGame === 2 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl space-y-6 text-center">
          <div className="space-y-1">
            <span className="text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1 rounded-full">
              Trò chơi 2: Quan sát tranh và chọn 1 trong 4 đáp án
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-800">Picture Quiz</h3>
          </div>

          <div className="max-w-md mx-auto space-y-6">
            <div className="text-8xl select-none p-6 bg-slate-50 rounded-3xl border border-slate-100 shadow-inner animate-bounce">
              {quizItems[quizRound].icon}
            </div>

            <h4 className="font-bold text-lg text-slate-800">
              {quizItems[quizRound].question}
            </h4>

            <div className="grid grid-cols-2 gap-3">
              {quizItems[quizRound].options.map((opt, i) => {
                const isCorrect = i === quizItems[quizRound].correct;
                const isSelected = quizSelected === i;

                let btnStyle = 'border-slate-200 bg-white text-slate-800 hover:border-sky-400';
                if (quizSelected !== null) {
                  if (isCorrect) btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-300';
                  else if (isSelected) btnStyle = 'border-rose-400 bg-rose-50 text-rose-800';
                }

                return (
                  <button
                    key={i}
                    disabled={quizSelected !== null}
                    onClick={() => {
                      setQuizSelected(i);
                      if (isCorrect) {
                        playCorrectChime();
                        playStarDing();
                        setGameScore((prev) => prev + 10);
                        onAddStars(1);
                      } else {
                        playTryAgainSound();
                      }
                    }}
                    className={`p-4 rounded-2xl border-2 font-bold text-sm sm:text-base transition-all ${btnStyle}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {quizSelected !== null && (
              <button
                onClick={() => {
                  setQuizSelected(null);
                  setQuizRound((prev) => (prev < quizItems.length - 1 ? prev + 1 : 0));
                }}
                className="px-6 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-bold text-xs shadow-md"
              >
                Câu tiếp theo <ArrowRight className="w-3.5 h-3.5 inline ml-1" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ==================== GAME 3: LISTEN AND CHOOSE ==================== */}
      {activeGame === 3 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl space-y-6 text-center">
          <div className="space-y-1">
            <span className="text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
              Trò chơi 3: Nghe phát âm và chọn câu đúng
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-800">Listen and Choose</h3>
          </div>

          <div className="max-w-md mx-auto space-y-5">
            <button
              onClick={() => speakEnglish(listenItems[listenRound].audio)}
              className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/20 hover:scale-105 transition-all mx-auto"
            >
              <Volume2 className="w-10 h-10" />
            </button>
            <p className="text-xs text-slate-500 font-medium">Bấm vào loa để nghe lại</p>

            <div className="space-y-2">
              {listenItems[listenRound].options.map((opt, i) => {
                const isCorrect = i === listenItems[listenRound].correct;
                const isSelected = listenSelected === i;

                let btnStyle = 'border-slate-200 bg-white text-slate-800 hover:border-purple-400';
                if (listenSelected !== null) {
                  if (isCorrect) btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-800';
                  else if (isSelected) btnStyle = 'border-rose-400 bg-rose-50 text-rose-800';
                }

                return (
                  <button
                    key={i}
                    disabled={listenSelected !== null}
                    onClick={() => {
                      setListenSelected(i);
                      if (isCorrect) {
                        playCorrectChime();
                        playStarDing();
                        setGameScore((prev) => prev + 10);
                        onAddStars(1);
                      } else {
                        playTryAgainSound();
                      }
                    }}
                    className={`w-full p-4 rounded-2xl border-2 font-bold text-sm text-left transition-all ${btnStyle}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {listenSelected !== null && (
              <button
                onClick={() => {
                  setListenSelected(null);
                  setListenRound((prev) => (prev < listenItems.length - 1 ? prev + 1 : 0));
                }}
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs shadow-md"
              >
                Câu tiếp theo
              </button>
            )}
          </div>
        </div>
      )}

      {/* ==================== GAME 4: MAGIC WHEEL ==================== */}
      {activeGame === 4 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl space-y-6 text-center">
          <div className="space-y-1">
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
              Trò chơi 4: Vòng quay thử thách ngôn ngữ
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-800">Magic Wheel of English</h3>
            <p className="text-xs text-slate-500">
              Quay vòng tròn ma thuật để nhận một nhiệm vụ hoặc câu hỏi thú vị!
            </p>
          </div>

          <div className="flex flex-col items-center space-y-6">
            {/* Animated SVG Wheel */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72">
              {/* Pointer indicator */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-x-8 border-x-transparent border-t-16 border-t-rose-600 filter drop-shadow-md" />

              {/* Rotating disk */}
              <div
                className="w-full h-full rounded-full border-8 border-amber-400 shadow-2xl overflow-hidden transition-transform duration-[3000ms] ease-out relative"
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                <div className="w-full h-full bg-gradient-to-tr from-sky-400 via-amber-300 to-rose-400 flex items-center justify-center">
                  <div className="grid grid-cols-2 w-full h-full">
                    <div className="bg-sky-400 flex items-center justify-center font-bold text-white text-xs p-2">
                      ⭐ 3 Colors
                    </div>
                    <div className="bg-amber-400 flex items-center justify-center font-bold text-slate-800 text-xs p-2">
                      🐾 Animals
                    </div>
                    <div className="bg-rose-400 flex items-center justify-center font-bold text-white text-xs p-2">
                      👋 Say Hello
                    </div>
                    <div className="bg-emerald-400 flex items-center justify-center font-bold text-white text-xs p-2">
                      🔢 Count 1-10
                    </div>
                  </div>
                </div>

                {/* Center hub */}
                <div className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-white shadow-lg border-4 border-amber-400 flex items-center justify-center font-black text-xs text-slate-700">
                  BUDDY
                </div>
              </div>
            </div>

            {/* Spin button */}
            <button
              disabled={spinning}
              onClick={spinMagicWheel}
              className={`px-8 py-3.5 rounded-2xl font-black text-sm shadow-xl transition-all transform active:scale-95 ${
                spinning
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-amber-500/30'
              }`}
            >
              {spinning ? 'VÒNG QUAY ĐANG XOAY...' : 'QUAY NGAY! 🎡'}
            </button>

            {/* Result prompt */}
            {wheelResult && (
              <div className="max-w-md w-full p-5 bg-amber-50 border-2 border-amber-300 rounded-2xl text-center space-y-2 animate-fadeIn">
                <span className="text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-200 px-3 py-1 rounded-full">
                  Thử thách dành cho con:
                </span>
                <p className="font-heading text-lg font-black text-amber-950">{wheelResult}</p>
                <p className="text-xs text-slate-500">
                  Con hãy đọc to câu trả lời hoặc nói cùng thầy cô/bạn bè để nhận 2 ⭐ nhé!
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== GAME 5: WORD PUZZLE ==================== */}
      {activeGame === 5 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl space-y-6 text-center">
          <div className="space-y-1">
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              Trò chơi 5: Sắp xếp các từ thành câu Tiếng Anh có nghĩa
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-800">Word Puzzle Maker</h3>
            <p className="text-xs text-slate-500">Chạm vào các từ để ghép thành câu hoàn chỉnh theo đúng ngữ pháp.</p>
          </div>

          <div className="max-w-lg mx-auto space-y-6">
            {/* Slot area */}
            <div className="min-h-[72px] p-4 bg-slate-50 border-2 border-dashed border-indigo-200 rounded-2xl flex flex-wrap items-center justify-center gap-2">
              {currentSentenceSlots.length === 0 ? (
                <span className="text-xs text-slate-400 font-medium italic">
                  Các từ con chọn sẽ xuất hiện ở đây...
                </span>
              ) : (
                currentSentenceSlots.map((w, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-indigo-600 text-white font-bold text-sm rounded-xl shadow-xs animate-fadeIn"
                  >
                    {w}
                  </span>
                ))
              )}
            </div>

            {/* Remaining word choices */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400">Chọn từ còn lại:</span>
              <div className="flex flex-wrap justify-center gap-2">
                {remainingWords.map((word, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAddSlot(word, idx)}
                    className="px-4 py-2 bg-white border-2 border-indigo-200 hover:border-indigo-500 hover:bg-indigo-50 rounded-xl font-bold text-sm text-slate-800 shadow-xs transition-all"
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>

            {/* Check status */}
            {remainingWords.length === 0 && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold text-sm animate-fadeIn">
                {currentSentenceSlots.join(' ') === puzzleItems[puzzleRound].target ? (
                  <div>
                    🎉 Tuyệt vời! Câu hoàn chỉnh: "{puzzleItems[puzzleRound].target}"
                  </div>
                ) : (
                  <div className="text-rose-600">
                    Chưa đúng thứ tự rồi, con hãy bấm "Làm lại" để xếp lại nhé!
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-center gap-3">
              <button
                onClick={handleResetPuzzle}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-600 flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Xếp lại
              </button>
              {puzzleRound < puzzleItems.length - 1 && remainingWords.length === 0 && (
                <button
                  onClick={() => {
                    const next = puzzleRound + 1;
                    setPuzzleRound(next);
                    setCurrentSentenceSlots([]);
                    setRemainingWords(puzzleItems[next].scrambled);
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
                >
                  Câu tiếp theo
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== GAME 6: ENGLISH ADVENTURE ==================== */}
      {activeGame === 6 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl space-y-6">
          <div className="space-y-1 text-center">
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
              Trò chơi 6: Di chuyển qua các chặng thám hiểm
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-800">English Adventure</h3>
            <p className="text-xs text-slate-500">
              Vượt qua từng thử thách trên bản đồ để đưa robot Buddy đến Đích Chạm Sao Vàng!
            </p>
          </div>

          {/* Board Path Steps */}
          <div className="flex items-center justify-between relative max-w-xl mx-auto py-4">
            <div className="absolute top-1/2 left-0 right-0 h-2 bg-slate-100 -translate-y-1/2 z-0" />
            <div
              className="absolute top-1/2 left-0 h-2 bg-gradient-to-r from-emerald-400 to-sky-500 -translate-y-1/2 z-0 transition-all duration-500"
              style={{ width: `${(adventureStep / (boardSteps.length - 1)) * 100}%` }}
            />

            {boardSteps.map((b, idx) => (
              <div key={b.step} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-black text-xs sm:text-sm border-4 transition-all ${
                    idx < adventureStep
                      ? 'bg-emerald-500 border-white text-white shadow-md'
                      : idx === adventureStep
                      ? 'bg-amber-400 border-white text-slate-900 ring-4 ring-amber-200 scale-110 shadow-lg'
                      : 'bg-slate-200 border-white text-slate-500'
                  }`}
                >
                  {idx === adventureStep ? '🤖' : idx < adventureStep ? '✓' : idx + 1}
                </div>
                <span className="text-[10px] font-bold text-slate-600 mt-2 text-center max-w-[80px]">
                  {b.title}
                </span>
              </div>
            ))}
          </div>

          {/* Current Step Question */}
          <div className="max-w-md mx-auto p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-100 px-3 py-1 rounded-full">
              Chặng {adventureStep + 1}: {boardSteps[adventureStep].title}
            </span>

            <h4 className="font-bold text-base sm:text-lg text-slate-800">
              {boardSteps[adventureStep].question}
            </h4>

            {adventureStep < boardSteps.length - 1 ? (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={adventureChoice || ''}
                    onChange={(e) => setAdventureChoice(e.target.value)}
                    placeholder="Nhập câu trả lời của con..."
                    className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl"
                  />
                  <button
                    onClick={() => handleAdventureAnswer(adventureChoice || '')}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold"
                  >
                    Mở khóa
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 italic">
                  Gợi ý đáp án: "{boardSteps[adventureStep].answer}"
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-4xl animate-bounce">🏆</div>
                <p className="font-bold text-emerald-700 text-sm">
                  Chúc mừng con đã xuất sắc hoàn thành toàn bộ cuộc phiêu lưu!
                </p>
                <button
                  onClick={() => setAdventureStep(0)}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold"
                >
                  Bắt đầu thám hiểm lại
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
