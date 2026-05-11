import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/FriendSearch.css";
import searchIcon from "../../assets/icon/search.png";


// 임시 사용자 데이터
const dummyUsers = [
    {
        id: "1",
        userId: 1,
        name: "나나",
        tag: "1234",
        bio: "안녕하세요! 저는 나나입니다.",
        profileImageUrl: null,
    },
    {
        id: "2",
        userId: 2,
        name: "얀",
        tag: "2342",
        bio: "^^",
        profileImageUrl: null,
    },
    {
        id: "3",
        userId: 3,
        name: "지말",
        tag: "1214",
        bio: "ㅎㅎ",
        profileImageUrl: null,
    },
    {
        id: "4",
        userId: 4,
        name: "코다",
        tag: "1223",
        bio: ";ㅁ;",
        profileImageUrl: null,
    },
    {
        id: "5",
        userId: 5,
        name: "딜런",
        tag: "1777",
        bio: ".",
        profileImageUrl: null,
    },
];

// 친구를 검색하고 팔로우할 수 있는 컴포넌트
function FriendSearch({
  title = "팔로우 요청",
  placeholder = "이름/태그로 검색",
  onFollow,
  followingList = [],
}) {
  const navigate = useNavigate();
  // 검색창에 입력한 값을 저장하는 state
  // 사용자가 input에 글자를 입력할 때마다 query 값이 바뀜
  const [query, setQuery] = useState("");

  // 이미 팔로우한 친구인지 확인하기 위해 followingList에서 id만 뽑아서 Set으로 만듦
  // followingList가 바뀔 때만 다시 계산되도록 useMemo를 사용함
  const followingIdSet = useMemo(() => {
    return new Set(followingList.map((x) => x.id));
  }, [followingList]);

  // 검색어가 바뀔 때마다 검색 결과를 계산함
  // query 값이 변경되면 useMemo가 다시 실행되고, 화면의 검색 결과도 바뀜
  const results = useMemo(() => {
    // 앞뒤 공백을 제거한 검색어
    const q = query.trim();
    // 검색어가 비어 있으면 검색 결과를 보여주지 않기 위해 빈 배열 반환
    if (!q) return [];

    // dummyUsers 배열에서 검색어와 일치하는 유저만 남김
    // 이름, 태그, 이름#태그 형식 중 하나라도 포함되면 검색 결과에 포함됨
    return dummyUsers.filter((user) => {
      return (
        user.name.includes(q) ||
        user.tag.includes(q) ||
        `${user.name}#${user.tag}`.includes(q)
      );
    });
  }, [query]);

  // 검색 결과에서 친구 정보를 클릭했을 때 상세 페이지로 이동
  // 선택한 친구 정보를 state로 같이 넘겨 상세 페이지에서 사용할 수 있게 함
  const goFriendDetail = (friend) => {
    navigate("/friends/detail", { state: { friend } });
  };

  return (
    <section className="friend-search">
      <h2 className="friend-search__title">{title}</h2>

      <div className="friend-search__input-box">
        <span className="friend-search__icon" aria-hidden="true">
          <img
            src={searchIcon}
            alt="검색"
            className="friend-search__icon-img"
          />
        </span>

        <input
          className="friend-search__input"
          value={query}
          // input 값이 바뀔 때마다 query state를 새 값으로 변경
          // state가 바뀌면 컴포넌트가 다시 렌더링되고 검색 결과도 다시 계산됨
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
        />
      </div>

      {query.trim() === "" ? null : results.length === 0 ? (
        <div className="friend-search__empty">검색 결과가 없습니다.</div>
      ) : (
        <ul className="friend-search__list">
          {/* 검색 결과 배열을 map으로 돌면서 사용자 목록을 화면에 출력 */}
          {results.map((user) => {
            // 현재 검색된 유저가 이미 팔로우 중인지 확인
            // 팔로우 중이면 버튼을 비활성화하고 "팔로잉"으로 표시
            const isFollowing = followingIdSet.has(user.id);

            return (
              <li key={user.id} className="friend-search__item">
                <div
                  className="friend-search__left"
                  role="button"
                  tabIndex={0}
                  onClick={() => goFriendDetail(user)}
                  onKeyDown={(e) => {
                    // Enter나 Space를 눌러도 이동되게 처리
                    if (e.key === "Enter" || e.key === " ") goFriendDetail(user);
                  }}
                >
                  <div className="friend-avatar" aria-hidden="true">
                    {user.profileImageUrl ? (
                      <img
                        src={user.profileImageUrl}
                        alt=""
                        className="friend-avatar__img"
                      />
                    ) : (
                      <UserIcon />
                    )}
                  </div>

                  <div className="friend-info">
                    <div className="friend-info__top">
                      <span className="friend-info__name">{user.name}</span>
                      <span className="friend-info__tag">#{user.tag}</span>
                    </div>

                    <div className="friend-info__bio">
                      {user.bio || "한 줄 소개"}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className={`friend-follow-btn ${
                    isFollowing ? "is-disabled" : ""
                  }`}
                  onClick={(e) => {
                    // 팔로우 버튼 클릭 시 사용자 정보 클릭 이벤트까지 같이 실행되지 않도록 막음
                    e.stopPropagation();
                    // 부모 컴포넌트에서 전달받은 팔로우 함수를 실행
                    // 선택한 user 객체를 넘겨서 부모 쪽에서 팔로우 목록에 추가할 수 있음
                    onFollow?.(user);
                  }}
                  disabled={isFollowing}
                >
                  {/* 이미 팔로우 중이면 팔로잉, 아니면 팔로우 표시 */}
                  {isFollowing ? "팔로잉" : "팔로우"}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

// 프로필 이미지가 없을 때 보여줄 기본 아이콘
function UserIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 12c2.761 0 5-2.239 5-5S14.761 2 12 2 7 4.239 7 7s2.239 5 5 5Z"
        fill="#ffffff"
        opacity="0.9"
      />
      <path
        d="M4 22c0-4.418 3.582-8 8-8s8 3.582 8 8"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default FriendSearch;