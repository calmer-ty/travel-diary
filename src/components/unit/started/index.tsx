// 훅
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
// import { useAuth } from "@/contexts/authContext";

// 외부 요소
import { FcGoogle } from "react-icons/fc";
// import { FlagIcon } from "react-flag-kit";
// import { Button } from "@mui/material";
import { motion } from "framer-motion";
import { Calendar, Globe, Monitor, Package, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const points = [
  {
    title: "월별 간편조회",
    desc: "월 단위로 매입/판매/재고/수익을 한눈에",
    icon: <Calendar size={24} />,
  },
  {
    title: "환율 적용",
    desc: "해외 통화를 원화로 변환해 매입·판매·수익 확인 가능",
    icon: <Globe size={24} />,
  },
  {
    title: "상품 관리",
    desc: "등록부터 판매까지 체계적 관리",
    icon: <Package size={24} />,
  },
  {
    title: "반응형 디자인",
    desc: "다양한 환경에서 최적화",
    icon: <Monitor size={24} />,
  },
];

export default function StartedUI() {
  // const { handleLogin } = useAuth();

  const MotionCard = motion(Card);

  return (
    <article>
      <section className="relative py-40 text-center bg-stone-800 text-white overflow-hidden">
        {/* 배경 장식 이미지 */}
        <img
          src="/images/started_2.svg"
          className="absolute left-10 top-8 w-170 opacity-10 pointer-events-none
          hidden lg:block"
          alt="왼쪽 이미지"
        />
        <img
          src="/images/started.svg"
          className="absolute right-12 bottom-6 w-90 opacity-40 pointer-events-none
          hidden lg:block"
          alt="오른쪽 이미지"
        />

        <motion.div className="relative z-10 max-w-4xl mx-auto px-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="mb-14">
            <h2 className="text-5xl font-bold mb-16">빈티지 노트</h2>
            <p className="text-xl mb-10">다양한 국가에서 사입한 상품들의 예상 수익을 간편하게 확인하세요.</p>
            <p className="text-lg text-gray-300">상품 관리와 대시보드로 매입가·판매가·재고를 정리하고 전체 흐름을 쉽게 파악할 수 있습니다.</p>
          </div>

          {/* 지원 국가 */}
          <div className="mb-10">
            <h3 className="text-lg font-medium mb-6">지원 가능 국가</h3>
            <ul className="flex justify-center gap-4">
              <li className="flex flex-col items-center gap-1 w-14">
                {/* <FlagIcon code="US" size={32} /> */}
                <span className="text-sm text-gray-300">미국</span>
              </li>
              <li className="flex flex-col items-center gap-1 w-14">
                {/* <FlagIcon code="JP" size={32} /> */}
                <span className="text-sm text-gray-300">일본</span>
              </li>
              <li className="flex flex-col items-center gap-1 w-14">
                {/* <FlagIcon code="KR" size={32} /> */}
                <span className="text-sm text-gray-300">대한민국</span>
              </li>
            </ul>
            {/* <p className="mt-2 text-sm text-gray-400">그 외 모든 국가 지원</p> */}
          </div>

          {/* 로그인 버튼 */}
          <div className="flex justify-center gap-4">
            <Button
              variant="default"
              // sx={{
              //   fontSize: "1rem",
              //   backgroundColor: "#e5e7eb",
              //   color: "#1f2937",
              //   "&:hover": {
              //     backgroundColor: "#f3f4f6",
              //   },
              // }}
              className="flex items-center justify-center gap-2"
              // onClick={handleLogin}
            >
              <FcGoogle size={20} />
              구글 로그인 하고 시작하기
            </Button>
            <Button
              variant="default"
              // sx={{
              //   fontSize: "1rem",
              //   backgroundColor: "#e5e7eb",
              //   color: "#1f2937",
              //   "&:hover": {
              //     backgroundColor: "#f3f4f6",
              //   },
              // }}
              className="flex items-center justify-center gap-2"
              // href="#points"
            >
              <Settings size={24} />
              기능 보기
            </Button>
          </div>
        </motion.div>
      </section>

      <section
        id="points"
        className="relative text-center bg-stone-50
         px-10 sm:px-18 
         py-20 sm:py-30 xl:py-52"
      >
        <motion.h3
          className=" text-3xl font-bold
            mb-12 sm:mb-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <strong className="text-stone-700 text-4xl">빈티지 노트</strong>의 주요 기능
        </motion.h3>
        <div
          className="grid gap-10
            grid-cols-1 sm:grid-cols-2 xl:grid-cols-4"
        >
          {points.map((el, idx) => (
            <MotionCard
              key={`${el.title}_${idx}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ delay: 0.6 + idx * 0.1, duration: 0.4 }}
              className="w-full group
                transition-shadow duration-300 ease-in-out hover:shadow-xl 
                py-4 lg:py-6"
            >
              <CardContent className="flex flex-col items-center">
                <div
                  className="mb-6 p-2 rounded-lg
                    transition-bg duration-300 ease-in-out bg-gray-100 group-hover:bg-gray-200 shadow-md"
                >
                  {el.icon}
                </div>
                <CardTitle className="mb-4 text-xl">{el.title}</CardTitle>
                <CardDescription className="text-md">{el.desc}</CardDescription>
              </CardContent>
              {/* <CardContent>
              <p>원하는 월을 선택하여 전반적인 매입금액, 판매금액, 재고, 수익 상태를 시각적으로 확인할 수 있습니다.</p>
            </CardContent> */}
            </MotionCard>
          ))}
        </div>
      </section>
    </article>
  );
}
