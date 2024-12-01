/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { FiPlus, FiTrash, FiLogOut } from "react-icons/fi";
import { motion } from "framer-motion";
import { FaFire } from "react-icons/fa";
import SOS from "../components/SOS";

export const UserCount = ({ userCount }) => {
  return { userCount };
};

// Add Login Component
const Login = ({ onLogin, existingUsers }) => {
  const [username, setUsername] = useState("");
  const [showExisting, setShowExisting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username.trim());
    }
  };

  const selectExistingUser = (selectedUser) => {
    onLogin(selectedUser);
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100">
      <SOS />
      <div className="w-80 rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-2xl text-gray-800">Login to Kanban</h2>
        <form onSubmit={handleSubmit} className="mb-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            className="mb-4 w-full rounded border border-gray-300 bg-gray-50 p-2 text-gray-800 placeholder-gray-400"
          />
          <button
            type="submit"
            className="w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600"
          >
            Login
          </button>
        </form>

        {existingUsers.length > 0 && (
          <div>
            <button
              onClick={() => setShowExisting(!showExisting)}
              className="mb-2 text-sm text-blue-500 hover:text-blue-400"
            >
              {showExisting ? "Hide existing users" : "Show existing users"}
            </button>

            {showExisting && (
              <div className="rounded border border-gray-300 p-2">
                <p className="mb-2 text-xs text-gray-500">
                  Select existing user:
                </p>
                <div className="flex flex-wrap gap-2">
                  {existingUsers.map((user) => (
                    <button
                      key={user}
                      onClick={() => selectExistingUser(user)}
                      className="rounded bg-gray-200 px-2 py-1 text-xs text-gray-700 hover:bg-gray-300"
                    >
                      {user}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const Home = () => {
  const [user, setUser] = useState(null);
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    recentUsers: [],
  });

  useEffect(() => {
    // Load user stats from localStorage
    const stats = localStorage.getItem("kanban-user-stats");
    if (stats) {
      setUserStats(JSON.parse(stats));
    }
  }, []);

  const updateUserStats = (username) => {
    const stats = JSON.parse(
      localStorage.getItem("kanban-user-stats") ||
        '{"totalUsers": 0, "recentUsers": []}'
    );

    // Check if this is a new user
    const isNewUser = !stats.recentUsers.includes(username);

    // Update stats
    const newStats = {
      totalUsers: isNewUser ? stats.totalUsers + 1 : stats.totalUsers,
      recentUsers: [
        username,
        ...stats.recentUsers.filter((u) => u !== username),
      ].slice(0, 5), // Keep only the 5 most recent users
    };

    // Save updated stats
    localStorage.setItem("kanban-user-stats", JSON.stringify(newStats));
    setUserStats(newStats);
  };

  const handleLogin = (username) => {
    setUser(username);
    updateUserStats(username);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="h-screen w-full bg-gray-100 text-gray-800">
      {!user ? (
        <Login onLogin={handleLogin} existingUsers={userStats.recentUsers} />
      ) : (
        <div className="h-full">
          <div className="flex justify-between p-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300"
            >
              <span>{user}</span>
              <FiLogOut />
            </button>
          </div>
          <Board user={user} />
        </div>
      )}
    </div>
  );
};

const Board = ({ user }) => {
  const [cards, setCards] = useState([]);

  // Load cards from localStorage when component mounts
  useEffect(() => {
    const savedCards = localStorage.getItem(`kanban-cards-${user}`);
    if (savedCards) {
      setCards(JSON.parse(savedCards));
    }
  }, [user]);

  // Save cards to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(`kanban-cards-${user}`, JSON.stringify(cards));
  }, [cards, user]);

  return (
    <div className="flex h-full w-full gap-3 overflow-scroll p-12">
      <Column
        title="Backlog"
        column="backlog"
        headingColor="text-gray-500"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="To Do"
        column="todo"
        headingColor="text-yellow-500"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="In Progress"
        column="doing"
        headingColor="text-blue-500"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="Complete"
        column="done"
        headingColor="text-green-500"
        cards={cards}
        setCards={setCards}
      />
      <BurnBarrel setCards={setCards} />
    </div>
  );
};

const Column = ({ title, headingColor, cards, column, setCards }) => {
  const [active, setActive] = useState(false);

  const handleDragStart = (e, card) => {
    e.dataTransfer.setData("cardId", card.id);
  };

  const handleDragEnd = (e) => {
    const cardId = e.dataTransfer.getData("cardId");

    setActive(false);
    clearHighlights();

    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);

    const before = element.dataset.before || "-1";

    if (before !== cardId) {
      let copy = [...cards];

      let cardToTransfer = copy.find((c) => c.id === cardId);
      if (!cardToTransfer) return;
      cardToTransfer = { ...cardToTransfer, column };

      copy = copy.filter((c) => c.id !== cardId);

      const moveToBack = before === "-1";

      if (moveToBack) {
        copy.push(cardToTransfer);
      } else {
        const insertAtIndex = copy.findIndex((el) => el.id === before);
        if (insertAtIndex === undefined) return;

        copy.splice(insertAtIndex, 0, cardToTransfer);
      }

      setCards(copy);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    highlightIndicator(e);

    setActive(true);
  };

  const clearHighlights = (els) => {
    const indicators = els || getIndicators();

    indicators.forEach((i) => {
      i.style.opacity = "0";
    });
  };

  const highlightIndicator = (e) => {
    const indicators = getIndicators();

    clearHighlights(indicators);

    const el = getNearestIndicator(e, indicators);

    el.element.style.opacity = "1";
  };

  const getNearestIndicator = (e, indicators) => {
    const DISTANCE_OFFSET = 50;

    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();

        const offset = e.clientY - (box.top + DISTANCE_OFFSET);

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    );

    return el;
  };

  const getIndicators = () => {
    return Array.from(document.querySelectorAll(`[data-column="${column}"]`));
  };

  const handleDragLeave = () => {
    clearHighlights();
    setActive(false);
  };

  const filteredCards = cards.filter((c) => c.column === column);

  return (
    <div className="w-56 shrink-0">
      <div className="mb-3 flex items-center justify-between">
        <h3 className={`font-medium ${headingColor}`}>{title}</h3>
        <span className="rounded text-sm text-neutral-400">
          {filteredCards.length}
        </span>
      </div>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`h-full w-full transition-colors ${
          active ? "bg-neutral-800/50" : "bg-neutral-800/0"
        }`}
      >
        {filteredCards.map((c) => {
          return <Card key={c.id} {...c} handleDragStart={handleDragStart} />;
        })}
        <DropIndicator beforeId={null} column={column} />
        <AddCard column={column} setCards={setCards} />
      </div>
    </div>
  );
};

const Card = ({ title, id, column, handleDragStart }) => {
  return (
    <>
      <DropIndicator beforeId={id} column={column} />
      <motion.div
        layout
        layoutId={id}
        draggable="true"
        onDragStart={(e) => handleDragStart(e, { title, id, column })}
        className="cursor-grab rounded border border-neutral-700 bg-neutral-800 p-3 active:cursor-grabbing"
      >
        <p className="text-sm text-neutral-100">{title}</p>
      </motion.div>
    </>
  );
};

const DropIndicator = ({ beforeId, column }) => {
  return (
    <div
      data-before={beforeId || "-1"}
      data-column={column}
      className="my-0.5 h-0.5 w-full bg-violet-400 opacity-0"
    />
  );
};

const BurnBarrel = ({ setCards }) => {
  const [active, setActive] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDragLeave = () => {
    setActive(false);
  };

  const handleDragEnd = (e) => {
    const cardId = e.dataTransfer.getData("cardId");

    setCards((pv) => pv.filter((c) => c.id !== cardId));

    setActive(false);
  };

  return (
    <div
      onDrop={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`mt-10 grid h-56 w-56 shrink-0 place-content-center rounded border text-3xl ${
        active
          ? "border-red-800 bg-red-800/20 text-red-500"
          : "border-neutral-500 bg-neutral-500/20 text-neutral-500"
      }`}
    >
      {active ? <FaFire className="animate-bounce" /> : <FiTrash />}
    </div>
  );
};

const AddCard = ({ column, setCards }) => {
  const [text, setText] = useState("");
  const [adding, setAdding] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!text.trim().length) return;

    const newCard = {
      column,
      title: text.trim(),
      id: Math.random().toString(),
    };

    setCards((pv) => [...pv, newCard]);
    setText("");
    setAdding(false);
  };

  return (
    <>
      {adding ? (
        <motion.form layout onSubmit={handleSubmit}>
          <textarea
            onChange={(e) => setText(e.target.value)}
            autoFocus
            placeholder="Add new task..."
            className="w-full rounded border border-violet-400 bg-violet-400/20 p-3 text-sm text-neutral-50 placeholder-violet-300 focus:outline-0"
          />
          <div className="mt-1.5 flex items-center justify-end gap-1.5">
            <button
              onClick={() => setAdding(false)}
              className="px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
            >
              Close
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded bg-neutral-50 px-3 py-1.5 text-xs text-neutral-950 transition-colors hover:bg-neutral-300"
            >
              <span>Add</span>
              <FiPlus />
            </button>
          </div>
        </motion.form>
      ) : (
        <motion.button
          layout
          onClick={() => setAdding(true)}
          className="flex w-full items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
        >
          <span>Add card</span>
          <FiPlus />
        </motion.button>
      )}
    </>
  );
};
