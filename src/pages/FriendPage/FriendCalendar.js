import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import React, { useState } from "react";
import "../../styles/Calendar.css";

// Date 객체를 YYYY-MM-DD 문자열로 바꾸는 함수
const toDateKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

// 날짜별 todo를 저장한 임시 데이터
const dummyTodosByDate = {
  "2026-05-04": [
    { id: 1, title: "프론트 보충자료 읽기", completed: true },
    { id: 2, title: "FriendCalendar 주석 달기", completed: false },
  ],
  "2026-05-06": [
    { id: 3, title: "친구 페이지 과제 제출", completed: true },
  ],
  "2026-05-10": [
    { id: 4, title: "React 복습하기", completed: false },
    { id: 5, title: "props 정리하기", completed: false },
    { id: 6, title: "useState 정리하기", completed: true },
  ],
};

// 친구의 todo가 표시되는 달력 컴포넌트
export default function FriendCalendar() {
  // 현재 달력에서 선택된 날짜를 저장
  // 날짜를 선택하면 이 state가 바뀌고 Calendar의 value에도 반영됨
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 사용자가 달력에서 날짜를 클릭했을 때 실행되는 함수
  const handleDateChange = (value) => {
    const next = value instanceof Date ? value : value?.[0];
    if (!next) return;
     // 선택된 날짜로 state를 변경
    setSelectedDate(next);
  };

  // 특정 날짜에 todo가 있는지 확인하고, 남은 todo 개수도 계산하는 함수
  const getDayMeta = (date) => {
    const key = toDateKey(date);
    const list = dummyTodosByDate[key] ?? [];

    // 해당 날짜에 todo가 없으면 표시할 내용이 없다는 정보를 반환
    if (list.length === 0) {
      return { hasTodos: false, remaining: 0, allDone: false };
    }

    // 완료되지 않은 todo만 filter로 골라서 남은 개수를 구함
    const remaining = list.filter((todo) => !todo.completed).length;

    return {
      hasTodos: true,
      remaining,
      allDone: remaining === 0,
    };
  };

  return (
    <div className="calendar-container">
      <Calendar
        // 날짜를 선택하면 handleDateChange가 실행됨
        onChange={handleDateChange}
        value={selectedDate}
        // 일요일부터 시작하는 일반 달력 형태
        calendarType="gregory"
        view="month"
        prev2Label={null}
        next2Label={null}
        showNeighboringMonth={true}
        // 날짜 칸에 '일' 같은 글자 없이 숫자만 표시
        formatDay={(locale, date) => String(date.getDate())}
        // 각 날짜 칸 안에 추가로 보여줄 내용을 정하는 부분
        tileContent={({ date, view }) => {
          if (view !== "month") return null;

          const { hasTodos, remaining, allDone } = getDayMeta(date);
          if (!hasTodos) return null;

          // todo가 모두 끝났으면 별 표시
          // 남은 todo가 있으면 남은 개수를 표시
          return <div className="tile-meta">{allDone ? "★" : remaining}</div>;
        }}
        // 날짜 칸에 적용할 className을 정하는 부분
        tileClassName={({ date, view }) => {
          if (view !== "month") return "";

          const { hasTodos, allDone } = getDayMeta(date);
          // todo가 없는 날짜에는 추가 클래스를 주지 않음
          if (!hasTodos) return "";

          // 모두 완료된 날짜와 아직 남은 todo가 있는 날짜를 다른 스타일로 보여줌
          return allDone ? "tile-done" : "tile-has";
        }}
      />
    </div>
  );
}