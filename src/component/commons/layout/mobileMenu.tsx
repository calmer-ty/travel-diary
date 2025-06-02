export default function MobileMenu() {
  return (
    <nav className="fixed bottom-0 z-10 w-full h-[50px] bg-[#EDE3CA] rounded-tl-4xl rounded-tr-4xl ">
      <ul className="size-full flex">
        <li className="flex justify-center items-center w-1/4 h-full">
          <button className="w-7 h-7 bg-contain bg-no-repeat bg-[url(/images/icon_home.png)]"></button>
        </li>
        <li className="flex justify-center items-center w-1/4 h-full">
          <button className="w-7 h-7 bg-contain bg-no-repeat bg-[url(/images/icon_diary.png)]"></button>
        </li>
        <li className="flex justify-center items-center w-1/4 h-full">
          <button className="w-7 h-7 bg-contain bg-no-repeat bg-[url(/images/icon_balloon.png)]"></button>
        </li>
        <li className="flex justify-center items-center w-1/4 h-full">
          <button className="w-5.5 h-5.5 bg-contain bg-no-repeat bg-[url(/images/icon_people.png)]"></button>
        </li>
      </ul>
    </nav>
  );
}
