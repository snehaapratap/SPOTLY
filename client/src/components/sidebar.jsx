/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  FiChevronsRight,
  FiDollarSign,
  FiHome,
  FiShoppingCart,
  FiTag,
  FiUsers,
  FiUser,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { Home } from "../mainPage/toDo";
import UserLocation from "../mainPage/dashBoard";

import { ChatBott } from "./chatBot";
import SOS from "./SOS";
import { GrMapLocation } from "react-icons/gr";
import { MapFilterPage } from "./MapFilterPage";
import workingImage from "./working.jpg";

export const Example = () => {
  const [selected, setSelected] = useState("Dashboard");

  return (
    <div className="flex bg-indigo-50">
      <Sidebar selected={selected} setSelected={setSelected} />
      <ExampleContent selected={selected} />
    </div>
  );
};

const loggedUser = localStorage.getItem("loggedInUser");

const Sidebar = ({ selected, setSelected }) => {
  const [open, setOpen] = useState(true);

  return (
    <motion.nav
      layout
      className="sticky top-0 h-screen shrink-0 border-r border-slate-300 bg-white p-2"
      style={{
        width: open ? "225px" : "fit-content",
      }}
    >
      <TitleSection open={open} />

      <div className="space-y-1">
        <Option
          Icon={FiHome}
          title="Dashboard"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
        <Option
          Icon={FiDollarSign}
          title="Pro Planner"
          selected={selected}
          setSelected={setSelected}
          open={open}
          notifs={1}
        />

        <Option
          Icon={FiShoppingCart}
          title="Products"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
        <Option
          Icon={FiTag}
          title="chatbot"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
        {/* <Option
          Icon={FiBarChart}
          title="Analytics"
          selected={selected}
          setSelected={setSelected}
          open={open}
        /> */}
        <Option
          Icon={FiUsers}
          title="Community tab"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
        <Option
          Icon={GrMapLocation}
          title="Map Filter"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
        <Option
          Icon={FiUser}
          title={loggedUser ? `${loggedUser}(you)` : "You"}
          open={open}
        />
      </div>

      <ToggleClose open={open} setOpen={setOpen} />
    </motion.nav>
  );
};

const Option = ({ Icon, title, selected, setSelected, open, notifs }) => {
  return (
    <motion.button
      layout
      onClick={() => setSelected(title)}
      className={`relative flex h-10 w-full items-center rounded-md transition-colors ${
        selected === title
          ? "bg-indigo-100 text-indigo-800"
          : "text-slate-500 hover:bg-slate-100"
      }`}
    >
      <motion.div
        layout
        className="grid h-full w-10 place-content-center text-lg"
      >
        <Icon />
      </motion.div>
      {open && (
        <motion.span
          layout
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.125 }}
          className="text-xs font-medium"
        >
          {title}
        </motion.span>
      )}

      {notifs && open && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          style={{ y: "-50%" }}
          transition={{ delay: 0.5 }}
          className="absolute right-2 top-1/2 size-4 rounded bg-indigo-500 text-xs text-white"
        >
          {notifs}
        </motion.span>
      )}
    </motion.button>
  );
};

const TitleSection = ({ open }) => {
  return (
    <div className="mb-3 border-b border-slate-300 pb-3">
      <div className="flex cursor-pointer items-center justify-between rounded-md transition-colors hover:bg-slate-100">
        <div className="flex items-center gap-2">
          <Logo />
          {open && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.125 }}
            >
              <span className="block text-xxl font-semibold">SpotLy</span>
              <span className="block text-xs text-slate-500">Pro Planer</span>
            </motion.div>
          )}
        </div>
        {/* {open && <FiChevronDown className="mr-2" />} */}
      </div>
    </div>
  );
};

const Logo = () => {
  return (
    <motion.div
      layout
      className="grid size-10 shrink-0 place-content-center rounded-md bg-indigo-600"
    >
      <svg
        width="24"
        height="auto"
        viewBox="0 0 50 39"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="fill-slate-50"
      >
        <path
          d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z"
          stopColor="#000000"
        ></path>
        <path
          d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z"
          stopColor="#000000"
        ></path>
      </svg>
    </motion.div>
  );
};

const ToggleClose = ({ open, setOpen }) => {
  return (
    <motion.button
      layout
      onClick={() => setOpen((pv) => !pv)}
      className="absolute bottom-0 left-0 right-0 border-t border-slate-300 transition-colors hover:bg-slate-100"
    >
      <div className="flex items-center p-2">
        <motion.div
          layout
          className="grid size-10 place-content-center text-lg"
        >
          <FiChevronsRight
            className={`transition-transform ${open && "rotate-180"}`}
          />
        </motion.div>
        {open && (
          <motion.span
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.125 }}
            className="text-xs font-medium"
          >
            Hide
          </motion.span>
        )}
      </div>
    </motion.button>
  );
};

const ExampleContent = ({ selected }) => {
  return (
    <div className="flex-1 overflow-auto">
      <div className="h-full p-4">
        {selected === "Dashboard" && (
          <motion.div
            initial={{ opacity: 0, y: 90 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <UserLocation />
            <SOS />
          </motion.div>
        )}

        {selected === "Pro Planner" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white h-full rounded-lg shadow-sm overflow-auto"
          >
            <div className="h-full">
              <Home />
              <SOS />
              {/* <MapLibreComponent /> */}
            </div>
          </motion.div>
        )}
        {selected === "chatbot" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white h-full rounded-lg shadow-sm overflow-auto"
          >
            <div className="h-full">
              <ChatBott />
              <SOS />
            </div>
          </motion.div>
        )}
        {selected === "Products" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white h-full rounded-lg shadow-sm overflow-auto"
            style={{
              backgroundImage: `url(${workingImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></motion.div>
        )}

        {selected === "Community tab" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white h-full rounded-lg shadow-sm overflow-auto"
            style={{
              backgroundImage: `url(${workingImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></motion.div>
        )}

        {selected === "Map Filter" && (
          <motion.div
            initial={{ opacity: 0, y: 90 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg shadow-sm"
          >
            <MapFilterPage />
            <SOS />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Example;
