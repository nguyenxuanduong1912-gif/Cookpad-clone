import { Link, useOutletContext } from "react-router-dom";
import Button from "../components/Button";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import Tippy from "@tippyjs/react/headless";
import RecipeSame from "../components/RecipeSame";
import { useReactToPrint } from "react-to-print";
import { useParams } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { toast } from "react-toastify";
import { userContext } from "../context/UserContext";
import { useContext } from "react";
import { Image } from "primereact/image";
import { Modal } from "@mui/material";
import TextareaAutosize from "react-textarea-autosize";
import RecipeHealthInfo from "../components/RecipeHealthInfo";
function RecipeDetail() {
  const { id } = useParams();
  const [data, setData] = useState({});
  const { user, setUser } = useContext(userContext);
  const [folowStatus, setFollowStatus] = useState(false);
  const [save, setSave] = useState(true);
  const [commentStatus, setCommentStatus] = useState(false);
  const emojis = ["😋", "❤️", "👏"];
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const printRef = useRef(null);
  const [selected, setSelected] = useState([]);
  const [copy, setCopy] = useState(false);
  const [copyURL, setCopyURL] = useState(false);
  const [focus, setFocus] = useState(false);
  const [commentLenght, setCommentLenght] = useState(0);
  const [contentComment, setContentComment] = useState("");
  const [timeElapsed, setTimeElapsed] = useState(0);
  const { openLogin, setOpenLogin } = useOutletContext();
  const [isTrue, setIsTrue] = useState(false);
  const [cookingNumberStatus, setCookingNumberStatus] = useState(false);
  const [reportStatus1, setReportStatus1] = useState(false);
  const [reportStatus2, setReportStatus2] = useState(false);
  const [reportStatus, setReportStatus] = useState(false);
  const [reportContent, setReportContent] = useState("");
  const handleDelete = async (id) => {
    const result = confirm("Bạn có chắc chắn muốn xóa món này?");
    if (result) {
      try {
        const res = await axiosClient.delete(`/recipes/${id}`);
        window.location.href = "/";
      } catch (error) {}
    }
  };
  const handlePublic = async (id) => {
    const result = confirm("Bạn có chắc chắn muốn lên sóng món này?");
    if (result) {
      try {
        const res = await axiosClient.put(`/recipes/publish/${id}`);
        console.log(res.data);
        window.location.href = `/me/library?source=published`;
      } catch (error) {
        console.log(error.response.data.message);
      }
    }
  };
  const [reference, setReference] = useState({
    text: [],
    link: [],
  });
  const [popupStatus, setPopupStatus] = useState({
    share: false,
    report: false,
    delete: false,
  });
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopy(text);
    } catch (error) {
      console.error("Lỗi khi copy: ", error);
    }
  };
  const handleCopyLink = async () => {
    try {
      const currentURL = window.location.href;
      await navigator.clipboard.writeText(currentURL);
      setCopyURL(true);
    } catch (error) {
      console.error("Lỗi khi copy: ", error);
    }
  };
  const handlePrint = useReactToPrint({
    contentRef: () => printRef.current,
    documentTitle: "Nội dung được in",
  });
  const formatDate = (createdAt) => {
    const date = new Date(createdAt);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const formatted = `${day} tháng ${month} năm ${year}`;
    return formatted;
  };
  const formatMinutesToHours = (minutes) => {
    if (minutes < 60) {
      return `${minutes} phút`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (remainingMinutes === 0) {
      return `${hours} tiếng`;
    }

    return `${hours} tiếng ${remainingMinutes} phút`;
  };
  const handleSaveRecipe = async (userId, recipeId) => {
    try {
      const res = await axiosClient.put("/recipes/saveRecipe", {
        userId: userId,
        recipeId: recipeId,
      });
      const isSave = res.data.recipe.savedBy.some(
        (re) => re.userId === user?.id
      );
      setSave(isSave);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };
  const handleAddFeels = async (recipeId, userId, reaction) => {
    try {
      const res = await axiosClient.put("/recipes/reactions", {
        recipeId: recipeId,
        userId: userId,
        reaction: reaction,
      });
      const res2 = await axiosClient.get(`/recipes/${id}/similar`);
      setData(res.data);
      setData((pre) => ({ ...pre, ...res2.data }));
      const reactions = res.data.recipe.userReactions
        .filter((r) => r.userId.toString() === userId)
        .map((r) => r.reaction);
      setSelected(reactions);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };
  const handleFollowing = async (targetId) => {
    try {
      const req = await axiosClient.post("/accounts/following", {
        targetId,
      });
      setFollowStatus(true);
    } catch (error) {
      toast(error.response.data.message);
    }
  };
  const handleUnFollowing = async (targetId) => {
    try {
      const req = await axiosClient.delete(`/accounts/unFollowing/${targetId}`);
      setFollowStatus(false);
    } catch (error) {
      toast(error.response.data.message);
    }
  };
  const handleAddComment = async (recipeId, content) => {
    try {
      const res = await axiosClient.post("/comments/add", {
        recipeId,
        content,
      });
      setCommentStatus((pre) => !pre);
    } catch (error) {
      toast(error.response.data.message);
    }
  };
  const handleReport = async (recipeId, content) => {
    if (!content.trim()) {
      return;
    }
    try {
      await axiosClient.post(`/recipes/${recipeId}/report`, {
        userId: user?.id,
        reason: content,
      });
      setReportStatus(false);
      toast.success("Đã báo cáo");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  // };
  useEffect(() => {
    document.addEventListener("mousedown", (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    });
  }, [ref]);
  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const res = await axiosClient.get(`/recipes/${id}`);
        const isCreator =
          res.data.recipe.createdBy._id.toString() === user.id.toString();
        setIsTrue(isCreator);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [user]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosClient.get(`/recipes/${id}`, {
          params: { userId: user?.id },
        });

        const res2 = await axiosClient.get(`/recipes/${id}/similar`);

        setData({ ...res.data, ...res2.data });

        if (user?.id) {
          const reactions = res.data.recipe.userReactions
            .filter((r) => r.userId === user.id)
            .map((r) => r.reaction);
          setSelected(reactions);

          const isSave = res.data.recipe.savedBy.some(
            (re) => re.userId === user?.id
          );
          setSave(isSave);
          setFollowStatus(res.data.recipe.isFollowing);
        }

        res.data.recipe.steps.forEach((step) => {
          if (step.reference && step.referenceText) {
            setReference((pre) => ({
              ...pre,
              link: [...pre.link, step.reference],
              text: [...pre.text, step.referenceText],
            }));
          }
        });
      } catch (error) {
        toast(error.response?.data?.message || "Lỗi tải dữ liệu");
      }
    };

    fetchData();
  }, [user, folowStatus, commentStatus, cookingNumberStatus]);

  useEffect(() => {
    if (isTrue) return;

    const timer = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 60000);
    console.log(timeElapsed);

    if (data?.recipe?.cookTime) {
      if (timeElapsed >= data.recipe.cookTime) {
        const updateCookingNumber = async () => {
          try {
            const res = await axiosClient.put("/recipes/updateNumberCooking", {
              recipeId: data.recipe._id,
              userId: user.id,
            });
            setCookingNumberStatus((pre) => !pre);
          } catch (error) {
            toast(error.response.data.message);
          }
        };
        updateCookingNumber();
        clearInterval(timer); // dừng timer
      }
    }

    return () => clearInterval(timer);
  }, [timeElapsed]);

  useEffect(() => {
    const increaseView = async () => {
      try {
        const res = await axiosClient.put(`/recipes/${id}/view`);
      } catch (error) {}
    };
    increaseView();
  }, []);
  return (
    <>
      <div className=" p-[24px] mx-auto max-w-[1146px]">
        <div className="flex gap-[24px] mb-[32px]" ref={printRef}>
          <div>
            <div className="w-[300px] h-full max-h-[410px] rounded-[8px] overflow-hidden">
              <Image
                src={
                  data?.recipe?.image
                    ? data.recipe.image
                    : "https://global-web-assets.cpcdn.com/assets/blank4x3-59a0a9ef4e6c3432579cbbd393fb1f1f98d52b9b66a9aae284872b67434274b8.png"
                }
                alt=""
                preview
                className="block w-full h-full"
                imageClassName="w-full h-full object-cover rounded-[8px]"
              />
            </div>
          </div>

          <div className="flex flex-col flex-1">
            <div className="flex flex-col w-full">
              <h1 className="text-[3.4rem] text-[#4A4A4A] font-semibold line-clamp-1 w-full">
                {data?.recipe?.name && data.recipe.name}
              </h1>
              <div className="mt-[16px]">
                {data?.recipe?.recipeState &&
                  data.recipe.recipeState !== "draft" && (
                    <div className="px-[8px] py-[4px] text-[#939290] border-[#cececd] text-[1.4rem] rounded-[9999px] border w-fit">
                      <Link className="flex items-center gap-[4px]">
                        <img src="/cooksnap.svg" alt="" />
                        <span>"Mở hàng" cho cooksnap này</span>
                      </Link>
                    </div>
                  )}
              </div>
              {data?.recipe?.recipeState &&
                data.recipe.recipeState !== "draft" && (
                  <div className="mt-[16px]">
                    <div className="flex items-center text-[#939290] gap-[4px] text-[1.5rem]">
                      <img src="/bookmark.svg" alt="" />
                      <span>
                        {data?.recipe?.cookingNumber &&
                        data.recipe.cookingNumber > 0
                          ? `${data.recipe.cookingNumber} bếp khác đã nấu món này`
                          : "Hãy là người dầu tiên nấu món này"}
                      </span>
                    </div>
                  </div>
                )}
              <RecipeHealthInfo
                verified={data?.recipe?.verified}
                dietaryTags={data?.dietaryTags} // lấy từ API trả về
                poisonRisk={data?.poisonRisk} // lấy từ API trả về
              />
              <div className="mt-[16px]">
                <Link
                  to={`/profile/${data?.recipe?.createdBy?._id}`}
                  className="pt-[16px] flex items-center gap-[8px]"
                >
                  <img
                    src={
                      data?.recipe?.createdBy?.avatar &&
                      data.recipe.createdBy.avatar
                    }
                    alt=""
                    className="w-[40px] h-[40px] rounded-[50%]"
                  />
                  <div>
                    <span className="text-[1.4rem] font-semibold">
                      {data?.recipe?.createdBy?.fullName &&
                        data.recipe.createdBy.fullName}
                    </span>
                    {data?.recipe?.createdBy?.address && (
                      <div className="flex items-center gap-[4px]">
                        <img src="/location.svg" alt="" />
                        <span className="text-[1.2rem] text-[#606060]">
                          {data.recipe.createdBy.address}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              </div>
              <div className="mt-[16px] text-[1.4rem]">
                <p className="mb-[8px] line-clamp-3 text-[#606060]">
                  {data?.recipe?.description && data.recipe.description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-[1rem] mt-auto">
              {data?.recipe?.recipeState &&
                data.recipe.recipeState === "draft" && (
                  <Button
                    text={"Lên sóng"}
                    icon={<img src="/pen2.svg" alt="" />}
                    borderColor={"#FF9933"}
                    px={"16px"}
                    py={"8px"}
                    textColor={"#FF9933"}
                    onClick={() => handlePublic(data.recipe._id)}
                    bold
                  />
                )}
              {data?.recipe?.createdBy?._id &&
              user?.id === data.recipe.createdBy._id ? (
                <a href={`/recipe/${data.recipe._id}/update`}>
                  <Button
                    text={"Chỉnh sửa cách làm"}
                    icon={<img src="/pen2.svg" alt="" />}
                    borderColor={"#FF9933"}
                    px={"16px"}
                    py={"8px"}
                    textColor={"#FF9933"}
                    bold
                  />
                </a>
              ) : save && user ? (
                <Button
                  text={"Đã lưu"}
                  icon={<img src="/saved.svg" alt="" />}
                  borderColor={"#FF9933"}
                  px={"8px"}
                  py={"8px"}
                  textColor={"#FF9933"}
                  bold
                  onClick={() => {
                    handleSaveRecipe(user?.id, data.recipe._id);
                  }}
                />
              ) : (
                <Button
                  text={"Lưu món"}
                  icon={<img src="/bookmark_selected.svg" alt="" />}
                  borderColor={"#FF9933"}
                  px={"8px"}
                  py={"8px"}
                  textColor={"#FF9933"}
                  onClick={() => {
                    if (user) {
                      handleSaveRecipe(user?.id, data.recipe._id);
                    } else {
                      setOpenLogin(true);
                    }
                  }}
                  bold
                />
              )}

              {data?.recipe?.recipeState &&
                data.recipe.recipeState !== "draft" && (
                  <Tippy
                    zIndex={1}
                    visible={popupStatus.share}
                    onClickOutside={() =>
                      setPopupStatus((pre) => ({
                        ...pre,
                        share: false,
                      }))
                    }
                    appendTo="parent"
                    popperOptions={{
                      strategy: "fixed",
                    }}
                    placement="bottom-start"
                    interactive={true}
                    render={(attr) => {
                      return (
                        <>
                          <div
                            {...attr}
                            tabIndex={"-1"}
                            className="bg-white w-[160px] border"
                          >
                            <ul className="text-[#4A4A4A]">
                              <li className="p-[8px] text-center border-b">
                                <div
                                  className="flex items-center gap-[8px]"
                                  onClick={handleCopyLink}
                                >
                                  <img
                                    src="/copy.svg"
                                    alt=""
                                    className="w-[20px] h-[20px]"
                                  />
                                  <span
                                    onClick={async () => await handleCopyLink()}
                                  >
                                    Sao chép URL
                                  </span>
                                </div>
                                {copyURL && (
                                  <span className="p-[8px] mt-[5px] block text-[1.5rem] text-gray-400">
                                    Đã sao chép
                                  </span>
                                )}
                              </li>
                              <li className="p-[8px] text-center border-b">
                                <Link className="flex items-center gap-[8px]">
                                  <img
                                    src="/email.svg"
                                    alt=""
                                    className="w-[20px] h-[20px]"
                                  />
                                  <span>Email</span>
                                </Link>
                              </li>
                              <li className="p-[8px] text-center border-b">
                                <Link className="flex items-center gap-[8px]">
                                  <img
                                    src="/facebook.svg"
                                    alt=""
                                    className="w-[20px] h-[20px]"
                                  />
                                  <span>Facebook</span>
                                </Link>
                              </li>
                              <li className="p-[8px] text-center border-b">
                                <Link className="flex items-center gap-[8px]">
                                  <img src="/printest.svg" alt="" />
                                  <span>Đánh dấu</span>
                                </Link>
                              </li>
                              <li className="p-[8px] text-center border-b">
                                <Link className="flex items-center gap-[8px]">
                                  <img src="/threedot.svg" alt="" />
                                  <span>XEM THÊM</span>
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </>
                      );
                    }}
                  >
                    <Button
                      text={"Chia sẻ"}
                      icon={<img src="/share.svg" alt="" />}
                      borderColor={"#cececd"}
                      px={"8px"}
                      py={"8px"}
                      textColor={"#606060"}
                      onClick={() =>
                        setPopupStatus((pre) => ({ ...pre, share: true }))
                      }
                    />
                  </Tippy>
                )}

              {data?.recipe?.createdBy?._id &&
                user?.id !== data.recipe.createdBy._id && (
                  <Button
                    text={"In"}
                    icon={<img src="/print.svg" alt="" />}
                    borderColor={"#cececd"}
                    px={"8px"}
                    py={"8px"}
                    textColor={"#606060"}
                    onClick={() => window.print()}
                  />
                )}
              <Tippy
                appendTo={document.body}
                zIndex={9999}
                onClickOutside={() => setReportStatus1(false)}
                visible={reportStatus1}
                popperOptions={{
                  strategy: "fixed",
                }}
                placement="bottom-start"
                interactive={true}
                render={(attr) => {
                  return (
                    <>
                      <div
                        {...attr}
                        tabIndex={"-1"}
                        className="bg-white w-[160px] border"
                      >
                        <ul className="text-[#4A4A4A]">
                          {data?.recipe?.createdBy?._id &&
                            user?.id !== data.recipe.createdBy._id && (
                              <li
                                className="p-[8px] text-center border-b cursor-pointer"
                                onClick={() => {
                                  setReportStatus(true);
                                  setReportStatus1(false);
                                }}
                              >
                                <div>
                                  <span>Báo cáo món này</span>
                                </div>
                              </li>
                            )}
                          {data?.recipe?.createdBy?._id &&
                            user?.id === data.recipe.createdBy._id && (
                              <li className="p-[8px] border-b">
                                <div className="flex items-center gap-[4px]">
                                  <img src="/print.svg" alt="" />
                                  <span>In</span>
                                </div>
                              </li>
                            )}
                          {data?.recipe?.createdBy?._id &&
                            user?.id === data.recipe.createdBy._id && (
                              <li
                                className="p-[8px] text-center border-b"
                                onClick={(e) => {
                                  handleDelete(data.recipe._id);
                                }}
                              >
                                <div className="flex items-center gap-[4px]">
                                  <img src="/bin.svg" alt="" />
                                  <span>Xóa</span>
                                </div>
                              </li>
                            )}
                        </ul>
                      </div>
                    </>
                  );
                }}
              >
                <img
                  src="/threedot.svg"
                  alt=""
                  className="cursor-pointer"
                  onClick={() => setReportStatus1(true)}
                />
              </Tippy>
              <Modal open={reportStatus}>
                <div className="w-[390px] scrollbar-hide overflow-y-auto absolute top-[46%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white border-none outline-none p-[16px] rounded-[8px] text-[#606060]">
                  <div className="flex items-center">
                    <h1 className="font-semibold text-center w-full">
                      Báo cáo
                    </h1>
                    <img
                      src="/close.svg"
                      alt=""
                      className="cursor-pointer"
                      onClick={() => setReportStatus(false)}
                    />
                  </div>
                  <TextareaAutosize
                    minRows={5}
                    maxRows={20}
                    maxLength={900}
                    placeholder="Vui lòng chỉ báo cáo nếu cách làm món này có chứa quảng cáo, ảnh khoả thân, ngôn từ kích động thù địch hoặc nội dung không liên quan. Admin của Cookpad sẽ xem xét trong thời gian ngắn nhất."
                    className="mt-[4px] resize-none border border-[#f93] outline-none no-scrollbar w-full text-[#606060] bg-transparent p-[8px] placeholder:text-[#CECECD] placeholder:text-[1.4rem] focus:border-[#f93]"
                    name="description"
                    value={reportContent}
                    onChange={(e) => setReportContent(e.target.value)}
                  />

                  <div className="flex items-center gap-[4px] justify-end">
                    <div
                      className="p-[8px] cursor-pointer"
                      onClick={() => setReportStatus(false)}
                    >
                      Hủy bỏ
                    </div>
                    <div
                      className="p-[8px] cursor-pointer text-[#f93]"
                      onClick={() =>
                        handleReport(data.recipe._id, reportContent)
                      }
                    >
                      Báo cáo
                    </div>
                  </div>
                </div>
              </Modal>
            </div>
          </div>
        </div>

        <div className="flex gap-[56px]">
          <div
            className={`sticky top-[54px] overflow-y-auto flex-shrink-0 ${
              data?.recipe?.recipeState && data.recipe.recipeState === "draft"
                ? "h-auto"
                : " h-[580px]"
            }`}
          >
            <div className="w-[268px]">
              <div className="pt-[8px] pb-[24px] mb-[24px] bg-white">
                <h2 className="text-[#4A4A4A] text-[2.4rem] font-semibold">
                  Nguyên liệu
                </h2>
                <div className="mt-[16px] flex items-center text-[#606060] gap-[4px]">
                  <img src="/user.svg" alt="" className="w-[16px] h-[16px]" />
                  <span className="text-[1.4rem]">
                    {data?.recipe?.servings && `${data.recipe.servings} người`}
                  </span>
                </div>

                <div className="mt-[16px]">
                  <ul className="text-[#4A4A4A]">
                    {data?.recipe?.ingredients &&
                      data.recipe.ingredients.map((ing, index) => (
                        <li
                          className={`py-[8px] ${
                            index + 1 !== 1 && "border-t border-[#ecebe9]"
                          }`}
                        >
                          <bdi className={`font-semibold `}>
                            {ing.quantity + " " + ing.unit + " "}
                          </bdi>
                          <span>{ing.name}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 flex-shrink-0 pb-[24px] mb-[24px] border-b border-[#ecebe9]">
            <div className="flex flex-col ">
              <h2 className="text-[#4A4A4A] text-[2.4rem] font-semibold">
                Hướng dẫn cách làm
              </h2>
              <div className="mt-[16px] flex items-center gap-[4px]">
                <img src="/clock.svg" alt="" className="w-[16px] h-[16px]" />
                <span className="text-[1.4rem] text-[#606060]">
                  {data?.recipe?.cookTime &&
                    formatMinutesToHours(data.recipe.cookTime)}
                </span>
              </div>

              <ul className="mt-[16px] w-full">
                {data?.recipe?.steps &&
                  data.recipe.steps.length > 0 &&
                  data.recipe.steps.map((step) => (
                    <li className="flex mb-[16px]">
                      <div className="mr-[8px]">
                        <div className="w-[24px] h-[24px] rounded-[50%] bg-[#4a4a4a] text-white flex items-center justify-center text-[1.4rem]">
                          {step.stepNumber}
                        </div>
                      </div>
                      <div className="flex flex-col gap-[8px] w-full">
                        <p className="text-[#4A4A4A] mb-[8px] flex-shrink-0">
                          {step.instruction}
                        </p>
                        <div className="w-full overflow-hidden rounded-[8px]">
                          <div className="flex gap-[8px] w-full flex-wrap">
                            {step.images.length > 0 &&
                              step.images.map((img, index) => (
                                <div
                                  key={index}
                                  className="w-[160px] h-[120px] rounded-[8px] overflow-hidden flex-shrink-0"
                                >
                                  <Image
                                    src={img}
                                    alt=""
                                    preview
                                    className="block w-full h-full" // áp vào wrapper <span>
                                    imageClassName="w-full h-full object-cover" // áp vào <img>
                                  />
                                </div>
                              ))}
                          </div>
                        </div>
                        {step.reference && (
                          <div className="flex items-center gap-[4px]">
                            <img src="/attachment.svg" alt="" />
                            <Link
                              to={step.reference}
                              target="blank"
                              className="text-[#41aeff] text-[1.2rem] underline"
                            >
                              {step.referenceText}
                            </Link>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
        {reference.link.length > 0 && reference.text.length && (
          <div className="pb-[24px] mb-[24px] border-b border-b-[#ecebe9] flex flex-col text-[#4A4A4A]">
            <h2 className="text-[2.2rem] font-semibold">Món đính kèm</h2>
            <div className="mt-[16px]">
              {reference.link.map((re, index) => (
                <p
                  className="pt-[4px] pb-[8px] border-b border-b-[#cececd] border-dashed"
                  key={index}
                >
                  <Link
                    to={reference.link[index]}
                    target="blank"
                    className="underline"
                  >
                    {re}
                  </Link>
                </p>
              ))}
            </div>
          </div>
        )}
        {data?.recipe?.recipeState && data.recipe.recipeState !== "draft" && (
          <div className="pb-[24px] mb-[24px] border-b border-[#ecebe9]">
            <p className="text-[1.2rem] text-[#606060] mb-[4px]">
              Mọi người đã bày tỏ cảm xúc với món ăn này
            </p>
            <ul className="flex items-center">
              <li className="w-fit">
                <div
                  className={`px-[10px] mr-[4px] text-[#606060] flex text-[1.2rem] ${
                    selected.includes("clap")
                      ? "bg-[#FDF1E2] border-[#FF9933]"
                      : "bg-[#eceae9] border-transparent"
                  } h-[24px] items-center border rounded-[9999px] cursor-pointer`}
                  onClick={() => {
                    if (user) {
                      handleAddFeels(data.recipe._id, user?.id, "clap");
                    } else {
                      setOpenLogin(true);
                    }
                  }}
                >
                  <span className="mr-[4px]">😋</span>
                  <span>
                    {data?.recipe?.reactions?.clap &&
                      data.recipe.reactions.clap}
                  </span>
                </div>
              </li>
              <li className="w-fit">
                <div
                  className={`px-[10px] mr-[4px] text-[#606060] flex text-[1.2rem] ${
                    selected.includes("heart")
                      ? "bg-[#FDF1E2] border-[#FF9933]"
                      : "bg-[#eceae9] border-transparent"
                  } h-[24px] items-center border rounded-[9999px] cursor-pointer`}
                  onClick={() => {
                    if (user) {
                      handleAddFeels(data.recipe._id, user?.id, "heart");
                    } else {
                      setOpenLogin(true);
                    }
                  }}
                >
                  <span className="mr-[4px]">❤️</span>
                  <span>
                    {data?.recipe?.reactions?.heart &&
                      data.recipe.reactions.heart}
                  </span>
                </div>
              </li>
              <li className="w-fit cursor-pointer">
                <div
                  className={`px-[10px] mr-[4px] text-[#606060] flex text-[1.2rem] ${
                    selected.includes("smile")
                      ? "bg-[#FDF1E2] border-[#FF9933]"
                      : "bg-[#eceae9] border-transparent"
                  } h-[24px] items-center border rounded-[9999px] cursor-pointer`}
                  onClick={() => {
                    if (user) {
                      handleAddFeels(data.recipe._id, user?.id, "smile");
                    } else {
                      setOpenLogin(true);
                    }
                  }}
                >
                  <span className="mr-[4px]">👏</span>
                  <span>
                    {data?.recipe?.reactions?.smile &&
                      data.recipe.reactions.smile}
                  </span>
                </div>
              </li>
            </ul>
          </div>
        )}

        <div className="flex items-center gap-[1rem] mt-auto pb-[24px] mb-[24px] border-b border-[#ecebe9]">
          <div className="flex items-center gap-[1rem] mt-auto">
            {data?.recipe?.recipeState &&
              data.recipe.recipeState === "draft" && (
                <Button
                  text={"Lên sóng"}
                  icon={<img src="/pen2.svg" alt="" />}
                  borderColor={"#FF9933"}
                  px={"16px"}
                  py={"8px"}
                  textColor={"#FF9933"}
                  onClick={() => handlePublic(data.recipe._id)}
                  bold
                />
              )}
            {data?.recipe?.createdBy?._id &&
            user?.id === data.recipe.createdBy._id ? (
              <Button
                text={"Chỉnh sửa cách làm"}
                icon={<img src="/pen2.svg" alt="" />}
                borderColor={"#FF9933"}
                px={"16px"}
                py={"8px"}
                textColor={"#FF9933"}
                bold
              />
            ) : save && user ? (
              <Button
                text={"Đã lưu"}
                icon={<img src="/saved.svg" alt="" />}
                borderColor={"#FF9933"}
                px={"8px"}
                py={"8px"}
                textColor={"#FF9933"}
                onClick={() => {
                  handleSaveRecipe(user?.id, data.recipe._id);
                }}
                bold
              />
            ) : (
              <Button
                text={"Lưu món"}
                icon={<img src="/bookmark_selected.svg" alt="" />}
                borderColor={"#FF9933"}
                px={"8px"}
                py={"8px"}
                textColor={"#FF9933"}
                onClick={() => {
                  if (user) {
                    handleSaveRecipe(user?.id, data.recipe._id);
                  } else {
                    setOpenLogin(true);
                  }
                }}
                bold
              />
            )}

            {data?.recipe?.recipeState &&
              data.recipe.recipeState !== "draft" && (
                <Tippy
                  zIndex={1}
                  visible={popupStatus.share}
                  onClickOutside={() =>
                    setPopupStatus((pre) => ({
                      ...pre,
                      share: false,
                    }))
                  }
                  appendTo="parent"
                  popperOptions={{
                    strategy: "fixed",
                  }}
                  placement="bottom-start"
                  interactive={true}
                  render={(attr) => {
                    return (
                      <>
                        <div
                          {...attr}
                          tabIndex={"-1"}
                          className="bg-white w-[160px] border"
                        >
                          <ul className="text-[#4A4A4A]">
                            <li className="p-[8px] text-center border-b">
                              <div
                                className="flex items-center gap-[8px]"
                                onClick={handleCopyLink}
                              >
                                <img
                                  src="/copy.svg"
                                  alt=""
                                  className="w-[20px] h-[20px]"
                                />
                                <span
                                  onClick={async () => await handleCopyLink()}
                                >
                                  Sao chép URL
                                </span>
                              </div>
                              {copyURL && (
                                <span className="p-[8px] mt-[5px] block text-[1.5rem] text-gray-400">
                                  Đã sao chép
                                </span>
                              )}
                            </li>
                            <li className="p-[8px] text-center border-b">
                              <Link className="flex items-center gap-[8px]">
                                <img
                                  src="/email.svg"
                                  alt=""
                                  className="w-[20px] h-[20px]"
                                />
                                <span>Email</span>
                              </Link>
                            </li>
                            <li className="p-[8px] text-center border-b">
                              <Link className="flex items-center gap-[8px]">
                                <img
                                  src="/facebook.svg"
                                  alt=""
                                  className="w-[20px] h-[20px]"
                                />
                                <span>Facebook</span>
                              </Link>
                            </li>
                            <li className="p-[8px] text-center border-b">
                              <Link className="flex items-center gap-[8px]">
                                <img src="/printest.svg" alt="" />
                                <span>Đánh dấu</span>
                              </Link>
                            </li>
                            <li className="p-[8px] text-center border-b">
                              <Link className="flex items-center gap-[8px]">
                                <img src="/threedot.svg" alt="" />
                                <span>XEM THÊM</span>
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </>
                    );
                  }}
                >
                  <Button
                    text={"Chia sẻ"}
                    icon={<img src="/share.svg" alt="" />}
                    borderColor={"#cececd"}
                    px={"8px"}
                    py={"8px"}
                    textColor={"#606060"}
                    onClick={() =>
                      setPopupStatus((pre) => ({ ...pre, share: true }))
                    }
                  />
                </Tippy>
              )}

            {data?.recipe?.createdBy?._id &&
              user?.id !== data.recipe.createdBy._id && (
                <Button
                  text={"In"}
                  icon={<img src="/print.svg" alt="" />}
                  borderColor={"#cececd"}
                  px={"8px"}
                  py={"8px"}
                  textColor={"#606060"}
                  onClick={() => window.print()}
                />
              )}
            <Tippy
              zIndex={1}
              onClickOutside={() => setVisible2(false)}
              visible={visible2}
              popperOptions={{
                strategy: "fixed",
              }}
              placement="bottom-start"
              interactive
              render={(attr) => {
                return (
                  <>
                    <div
                      {...attr}
                      tabIndex={"-1"}
                      className="bg-white w-[160px] border"
                    >
                      <ul className="text-[#4A4A4A]">
                        {data?.recipe?.createdBy?._id &&
                          user?.id !== data.recipe.createdBy._id && (
                            <li className="p-[8px] text-center border-b">
                              <Link>
                                <span>Báo cáo món này</span>
                              </Link>
                            </li>
                          )}
                        {data?.recipe?.createdBy?._id &&
                          user?.id === data.recipe.createdBy._id && (
                            <li className="p-[8px] border-b">
                              <Link className="flex items-center gap-[4px]">
                                <img src="/print.svg" alt="" />
                                <span>In</span>
                              </Link>
                            </li>
                          )}
                        {data?.recipe?.createdBy?._id &&
                          user?.id === data.recipe.createdBy._id && (
                            <li
                              className="p-[8px] text-center border-b"
                              onClick={() => handleDelete(data.recipe._id)}
                            >
                              <Link className="flex items-center gap-[4px]">
                                <img src="/bin.svg" alt="" />
                                <span>Xóa</span>
                              </Link>
                            </li>
                          )}
                      </ul>
                    </div>
                  </>
                );
              }}
            >
              <img
                src="/threedot.svg"
                alt=""
                className="cursor-pointer"
                onClick={() => setVisible2(true)}
              />
            </Tippy>
          </div>
        </div>

        <div>
          <div className="text-[1.4rem] text-[#4A4A4A] cursor-pointer pb-[24px] mb-[24px] border-b border-b-[#ecebe9]">
            <div
              className="flex items-center gap-[4px] justify-center"
              onClick={() => {
                handleCopy(data.recipe.id_recipe);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="none"
                viewBox="0 0 24 24"
                class="mise-icon mise-icon-copy"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M12 2H6a4 4 0 0 0-4 4v6a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4V6a4 4 0 0 0-4-4Z"
                ></path>
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M16 8h2a4 4 0 0 1 4 4v6a4 4 0 0 1-4 4h-6a4 4 0 0 1-4-4v-2"
                ></path>
              </svg>
              Id Công thức: {data?.recipe?.id_recipe && data.recipe.id_recipe}
            </div>
            {copy && (
              <p className="text-center text-[#939290] text-[1.4rem]">
                Đã sao chép
              </p>
            )}
          </div>
        </div>
        <div className="pb-[24px] mb-[24px]">
          <div className="mb-[16px] flex items-center gap-[16px]">
            <div className="w-[96px] h-[96px] overflow-hidden rounded-[50%]">
              <Link to={`/profile/${data?.recipe?.createdBy?._id}`}>
                <img
                  src={
                    data?.recipe?.createdBy?.avatar &&
                    data.recipe.createdBy.avatar
                  }
                  alt=""
                  className="object-contain w-[96px] h-[96px] overflow-hidden rounded-[50%]"
                />
              </Link>
            </div>
            <div>
              <span className="text-inherit text-[1.4rem] font-semibold">
                <Link to={`/profile/${data?.recipe?.createdBy?._id}`}>
                  {data?.recipe?.createdBy?.fullName &&
                    data.recipe.createdBy.fullName}
                </Link>
              </span>
              <div className="text-[#606060] text-[1.2rem]">
                <span>vào </span>
                <time dateTime="">
                  {data?.recipe?.createdAt && formatDate(data.recipe.createdAt)}
                </time>
              </div>
              {data?.recipe?.createdAt?.address && (
                <div className="mb-[8px]">
                  <img
                    src="/location.svg"
                    alt=""
                    className="inline-block mr-[2px]"
                  />
                  <span className="text-[#606060] text-[1.2rem]">
                    {data.recipe.createdAt.address}
                  </span>
                </div>
              )}
              <div className="text-[1.2rem]">
                {data?.recipe?.createdBy?._id &&
                  user?.id !== data.recipe.createdBy._id &&
                  (!folowStatus ? (
                    <Button
                      text={"Follow"}
                      textColor={"#ffff"}
                      px={"16px"}
                      py={"8px"}
                      bold
                      onClick={() => {
                        if (user) {
                          handleFollowing(data.recipe.createdBy._id);
                        } else {
                          setOpenLogin(true);
                        }
                      }}
                      color={"#EA284E"}
                    />
                  ) : (
                    <Button
                      text={"Đã follow"}
                      textColor={"#606060"}
                      px={"16px"}
                      py={"8px"}
                      onClick={() =>
                        handleUnFollowing(data.recipe.createdBy._id)
                      }
                      bold
                    />
                  ))}
              </div>
            </div>
          </div>

          <div className="line-clamp-3 text-[1.4rem] text-[#606060]">
            {data?.recipe?.createdAt?.description &&
              data.recipe.createdAt.description}
          </div>
        </div>

        <div className="flex flex-col pb-[24px] mb-[24px] border-b border-b-[#ecebe9]">
          <h2 className="text-[2.4rem] text-[#4A4A4A] font-semibold">
            Bình luận{" "}
            <span className="text-gray-400">
              {data?.comments && `(${data.comments.length})`}
            </span>
          </h2>

          <div className="mt-[16px]">
            <div className="p-[8px]">
              {data?.comments &&
                data.comments.length > 0 &&
                data.comments.map((cmt, index) => (
                  <div className="flex items-start gap-[8px]" key={index}>
                    <div className="w-[32px] h-[32px] overflow-hidden rounded-[50%]">
                      <Link to={`/profile/${cmt.userId._id}`}>
                        <img
                          src={cmt.userId.avatar}
                          alt=""
                          className="object-cover"
                        />
                      </Link>
                    </div>
                    <div>
                      <span className="text-[#4A4A4A] text-[1.4rem] font-semibold">
                        <Link to={`/profile/${cmt.userId._id}`}>
                          {cmt.userId.fullName}
                        </Link>
                      </span>
                      <div className="text-[#606060] text-[1.2rem]">
                        <time datetime="">{formatDate(cmt.createdAt)}</time>
                      </div>
                      <span className="text-[1.4rem] text-[#4A4A4A] mb-[8px] block">
                        {cmt.content}
                      </span>
                      <div className="mb-[5px]"></div>
                    </div>
                  </div>
                ))}
            </div>
            <div className="flex items-center gap-[8px] pt-[16px]">
              <Link>
                <img
                  src={
                    user?.avatar
                      ? user.avatar
                      : "https://global-web-assets.cpcdn.com/assets/guest_user-411965b370bbbfc1433c4478633d4974e180b506f29555ff58032b0ab04c5b56.png"
                  }
                  alt=""
                  className="w-[32px] h-[32px] rounded-[50%]"
                />
              </Link>

              <div className="w-full border flex items-center justify-between">
                <div className="mx-[16px] my-[8px] w-full h-full">
                  <textarea
                    maxLength={800}
                    className="resize-none outline-none no-scrollbar w-full h-full placeholder:text-[1.3rem] text-[1.3rem] text-[#606060]"
                    name=""
                    id=""
                    placeholder="Thêm bình luận"
                    onFocus={() => setFocus(true)}
                    onInput={(e) => {
                      setCommentLenght(e.target.value.length);
                      setContentComment(e.target.value);
                    }}
                    value={contentComment}
                  ></textarea>
                </div>
                <div
                  className="pr-[16px] cursor-pointer"
                  onClick={() => {
                    if (user) {
                      if (focus && commentLenght > 0) {
                        handleAddComment(data.recipe._id, contentComment);
                        setFocus(false);
                        setContentComment("");
                      }
                    } else {
                      setOpenLogin(true);
                    }
                  }}
                >
                  <svg
                    className="cursor-pointer"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                    class="text-cookpad-24 mise-icon mise-icon-send"
                  >
                    <path
                      stroke={`${focus ? "#FF9933" : "currentColor"}`}
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="m7 12-4 8 18-8L3 4l4 8Zm0 0h5"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end h-[20px]">
            {focus && (
              <span className="text-gray-400 text-[1.2rem]">
                {commentLenght}/800
              </span>
            )}
          </div>
        </div>
        {data?.recipe?.recipeState && data.recipe.recipeState !== "draft" && (
          <div className="flex flex-col">
            <h2 className="text-[2.4rem] text-[#4A4A4A] font-semibold">
              Các món tương tự
            </h2>
            {data?.similarRecipes && data.similarRecipes.length > 0 ? (
              <ul className="mt-[16px] columns-6 gap-[8px] relative border-b border-b-[#ecebe9]">
                {data.similarRecipes.map((recipe) => (
                  <RecipeSame
                    id={recipe._id}
                    src={recipe.image}
                    title={recipe.name}
                    desc={data.recipe.description}
                    tags={recipe.tags.slice(0, 5)}
                    avatar={recipe.createdBy.avatar}
                    name={recipe.createdBy.fullName}
                  />
                ))}

                <div class="absolute bottom-0 left-0 w-full h-[800px] bg-gradient-to-t from-[#fafafa] to-transparent pointer-events-none"></div>
                <div className="mx-auto absolute bottom-[50px] left-[50%] translate-x-[-50%]">
                  <Button
                    text={"Xem thêm chỉ với 25.000đ/Tháng"}
                    textColor={"#ffff"}
                    px={"16px"}
                    py={"12px"}
                    borderColor={"#f93"}
                    color={"#f93"}
                    bold
                  />
                </div>
              </ul>
            ) : (
              <p className="text-center mt-[20px]">
                Không có món ăn tương tự nào
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default RecipeDetail;
