export default function Main() {
  return (
    <div className="relative w-screen h-screen overflow-hidden p-5">
      <div className="relative size-full flex justify-center items-center gap-[3.125rem]">
        <div className="relative w-[37.5rem] h-[45.625rem] bg-[#FAFAF2] shadow-[6px_6px_0px_#AAAAAA] rounded-[1.25rem] border-solid border-gray-300 pt-[5rem] pl-[3.75rem] cursor-pointer">
          <div className="text-[3rem]">여기는 쌸라쌸라</div>

          <div className="text-[1.5rem] mt-[1.875rem]">
            <p>당신의 쏼라쏼라</p>
            <p>기록해봐 쏼랴쏼랴</p>
          </div>

          <img className="absolute bottom-[1.875rem] right-[1.875rem] w-[20.625rem]" src="./images/img_diary.png" alt="" />
        </div>

        <div className="flex justify-between items-center flex-col w-[37.5rem] h-[45.625rem] ">
          <div className="w-full h-[13.125rem]  bg-[#FAFAF2] shadow-[6px_6px_0px_#AAAAAA] rounded-[1.25rem] border-solid border-gray-300 cursor-pointer"></div>
          <div className="w-full h-[13.125rem]  bg-[#FAFAF2] shadow-[6px_6px_0px_#AAAAAA] rounded-[1.25rem] border-solid border-gray-300 cursor-pointer"></div>
          <div className="w-full h-[13.125rem]  bg-[#FAFAF2] shadow-[6px_6px_0px_#AAAAAA] rounded-[1.25rem] border-solid border-gray-300 cursor-pointer"></div>
        </div>
      </div>
    </div>
  );
}
