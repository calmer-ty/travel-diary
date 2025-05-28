export default function MobileMenu() {
  return (
    <div className="fixed bottom-[0] z-[10] w-full h-[50px] bg-[#EDE3CA] rounded-4xl rounded-br-none rounded-bl-none">
      <ul className="size-full flex">
        <li className="flex justify-center items-center w-1/4 h-full">
          <button className="h-7 w-7 bg-contain bg-no-repeat bg-[url(/images/icon_home.png)]"></button>
        </li>
        <li className="flex justify-center items-center w-1/4 h-full">
          <button className="h-7 w-7 bg-contain bg-no-repeat bg-[url(/images/icon_diary.png)]"></button>
        </li>
        <li className="flex justify-center items-center w-1/4 h-full">
          <button className="h-7 w-7 bg-contain bg-no-repeat bg-[url(/images/icon_balloon.png)]"></button>
        </li>
        <li className="flex justify-center items-center w-1/4 h-full">
          <button className="h-7 w-7 bg-contain bg-no-repeat bg-[url(/images/icon_people.png)]"></button>
        </li>
      </ul>
    </div>
  );
}
