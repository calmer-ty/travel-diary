export default function MainPage() {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div className="relative size-full p-10">
        <h2 className=" text-2xl font-medium pt-10">나의 여행 일기</h2>

        <div className="relative w-full  mt-10  rounded-3xl bg-[#fff] p-10 pt-20 pb-20 shadow-[12px_12px_0px_#ddd] border border-solid border-gray-300">
          <div className="flex flex-wrap justify-center items-center gap-18 w-full ">
            <div className="text-center text-lg justify-center items-center break-keep flex flex-col gap-5 ">
              <button className="w-30 h-30 bg-[#F5F4A9]  shadow-[3px_3px_0px_#CDCC86] rounded-[100%] hover:shadow-[-3px_-3px_0px_#CDCC86]">
                <img src="/images/icon_diary.png" alt="" className="ml-auto mr-auto size-ful object-contain" />
              </button>
              <span>여행 완성하기</span>
            </div>
            <div className="text-center text-lg justify-center items-center break-keep flex flex-col gap-5">
              <button className="w-30 h-30 bg-[#9BD5B3]  shadow-[3px_3px_0px_#70C192] rounded-[100%] hover:shadow-[-3px_-3px_0px_#70C192]">
                <img src="/images/icon_game.png" alt="" className="ml-auto mr-auto size-ful object-contain" />
              </button>
              <span>친구와 내기하기</span>
            </div>
            <div className="text-center text-lg justify-center items-center break-keep flex flex-col gap-5">
              <button className="w-30 h-30 bg-[#E3C7DC]  shadow-[3px_3px_0px_#E1A1D1] rounded-[100%] hover:shadow-[-3px_-3px_0px_#E1A1D1]">
                <img src="/images/icon_balloon.png" alt="" className="ml-auto mr-auto size-ful object-contain" />
              </button>
              <span>수다 떨기</span>
            </div>
            <div className="text-center text-lg justify-center items-center break-keep flex flex-col gap-5">
              <button className="w-30 h-30 bg-[#A9D5F5]  shadow-[3px_3px_0px_#79B2DB] rounded-[100%] hover:shadow-[-3px_-3px_0px_#79B2DB]">
                <img src="/images/icon_eyes.png" alt="" className="ml-auto mr-auto size-ful object-contain" />
              </button>
              <span>여행 구경하기</span>
            </div>
          </div>

          <div className="absolute top-[50%] left-[-20] h-full  w-9.5 bg-[url(/images/icon_spring.png)] bg-contain bg-no-repeat bg-center z-10 transform-[translateY(-50%)]"></div>
        </div>
      </div>
    </div>
  );
}
