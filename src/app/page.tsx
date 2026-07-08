import Quiz from "./quiz/page";

export default function Home() {
  return <div className="flex flox-col items-center justify-center">
    <div>
      <h1 className="mt-20 text-3xl font-bold">Assign number to item</h1><br />
      <p>A study of how we associate everyday items with abstract things such as numbers of colors</p>
      <button><a href="">Complete the quiz ()</a></button>
    </div>
  </div>;
}
