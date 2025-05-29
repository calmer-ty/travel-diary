export default function MainPage() {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div className="relative size-full p-10">
        <h2 className="text-2xl font-medium pt-10">나의 여행 일기</h2>

        <div className="relative size-full bg-[url(/images/img_diary.png)] bg-contain bg-no-repeat ">
          <div className=" flex flex-wrap justify-center items-center gap-2 w-80 ">
            <button className=" bg-white rounded-[100%] p-2 w-30 h-30 text-center break-keep">
              <img src="/images/icon_diary.png" alt="" className="ml-auto mr-auto" />
              <span>여행 완성하기</span>
            </button>
            <button className=" bg-white rounded-[100%] p-2 w-30 h-30 text-center break-keep">
              <img src="/images/icon_game.png" alt="" className="ml-auto mr-auto" />
              <span>친구와 내기하기</span>
            </button>
            <button className=" bg-white rounded-[100%] p-2 w-30 h-30 text-center break-keep">
              <img src="/images/icon_balloon.png" alt="" className="ml-auto mr-auto" />
              <span>수다 떨기</span>
            </button>
            <button className=" bg-white rounded-[100%] p-2 w-30 h-30 text-center break-keep">
              <img src="/images/icon_eyes.png" alt="" className="ml-auto mr-auto" />
              <span>여행 구경하기</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
