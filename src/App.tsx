import Header from "./components/Header";
import Note from "./components/Note";

function App() {
  return (
    <>
      <Header />
      <main className="p-2 h-[calc(100vh-56px)]">
        <Note />
      </main>
    </>
  );
}

export default App;
