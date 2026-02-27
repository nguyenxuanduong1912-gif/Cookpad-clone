import { useContext, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import TextareaAutosize from "react-textarea-autosize";
import ImagePreview from "../components/ImagePreview";
import { Image } from "primereact/image";
import Tippy from "@tippyjs/react/headless";
import { Modal } from "@mui/material";
import RecipeTag from "../components/RecipeTag";
import SecretRecipe from "../components/SecretRecipe";
import { userContext } from "../context/UserContext";
import TagInput from "../components/TagInput";
import axiosClient from "../api/axiosClient";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import CategorySelector from "../components/CategorySelector";
function UpdateRecipe() {
  const [fileKey, setFileKey] = useState(Date.now());
  const [secretRecipe, setSecretRecipe] = useState([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  ]);
  const { id } = useParams();
  const [underline, setUnderline] = useState("secret");
  const [isOpen, setIsOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState(null);
  const { user, setUser } = useContext(userContext);
  const [data, setData] = useState([]);
  const {
    steps,
    setSteps,
    warning,
    setWarning,
    ingredients,
    setIngredients,
    fields,
    setFields,
    draft,
    tags,
    setTags,
    imgeState,
    setImageState,
    categoryForm,
    setCategoryForm,
  } = useOutletContext();

  const handlePreview = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      setImgSrc(e.target.result);
      setImageState(true);
    };
    reader.readAsDataURL(file);
  };
  const handleUpdatePreviewStepImage = (e, stepId, iamgeId, image_NameId) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const newImage = e.target.result;
      setSteps((preSteps) =>
        preSteps.map((step) => {
          if (step.id === stepId) {
            const updateImages = step.image.map((img, index) =>
              index === iamgeId ? newImage : img
            );
            const updateImagesName = step.image_name.map((img, index) =>
              index === image_NameId ? file.name : img
            );
            return {
              ...step,
              image: updateImages,
              image_name: updateImagesName,
            };
          }
          return step;
        })
      );
    };
    reader.readAsDataURL(file);
  };
  const handleDeletePreviewStepImage = (stepId, imageId, image_NameId) => {
    const result = confirm("Bạn có chắc chắn muốn xóa ảnh này?");
    if (result) {
      setSteps((preSteps) =>
        preSteps.map((step) => {
          if (step.id === stepId) {
            const updateImages = step.image.filter(
              (img, index) => index !== imageId
            );
            const updateImagesName = step.image_name.filter(
              (name, index) => index !== image_NameId
            );
            return {
              ...step,
              image: updateImages,
              image_name: updateImagesName,
            };
          }
          return step;
        })
      );
    }
  };
  const handlePreviewStepImage = (e, id) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      setSteps((preStep) =>
        preStep.map((step) =>
          step.id === id
            ? {
                ...step,
                image: [...step.image, e.target.result],
                image_name: [...step.image_name, file.name],
              }
            : step
        )
      );
    };
    reader.readAsDataURL(file);
  };
  const handleField = (name, field, value) => {
    setFields((preFields) =>
      preFields.map((f) => (f.name === name ? { ...f, [field]: value } : f))
    );
  };
  const handleInput = (fuc, id, field, value) => {
    fuc((preIngres) =>
      preIngres.map((ing) => (ing.id === id ? { ...ing, [field]: value } : ing))
    );
  };
  const handleLinkInput = (fuc, id, key, value) => {
    fuc((preSteps) =>
      preSteps.map((step) =>
        step.id === id
          ? { ...step, link: { ...step.link, [key]: value } }
          : step
      )
    );
  };
  const getField = (name) => fields.find((f) => f.name === name) || {};
  const handleAddIngredient = (type) => {
    const item = {
      id: Date.now(),
      text: "",
      type,
      max: 200,
      numberVisible: false,
      warning: false,
    };
    setIngredients((preIngres) => [...preIngres, item]);
  };
  const handleDeleteIngredient = (id) => {
    setIngredients((preIngres) => preIngres.filter((ing) => ing.id !== id));
  };
  const handleAddStep = () => {
    const item = {
      id: Date.now(),
      text: "",
      max: 500,
      image: [],
      image_name: [],
      link: "",
      numberVisible: false,
    };
    setSteps((pre) => [...pre, item]);
  };
  const handleAddStep2 = (position) => {
    const item = {
      id: Date.now(),
      text: "",
      max: 500,
      image: [],
      image_name: [],
      link: "",
      numberVisible: false,
    };

    setSteps((pre) => {
      const newStep = [...pre];
      newStep.splice(position + 1, 0, item);
      return newStep;
    });
  };
  const handleDeleteStep = (id) => {
    setSteps((pre) => pre.filter((step) => step.id !== id));
  };
  const hasContext = (input) => {
    const text = input.replace(/[0-9.,\s]+[a-zA-Z%]*\s*/g, "");
    return text.trim().length > 0;
  };
  const handleDeleteLink = (id) => {
    setSteps((preSteps) =>
      preSteps.map((step) => (step.id === id ? { ...step, link: "" } : step))
    );
  };
  const handleChangeRation = (e, name) => {
    const input = e.target.value;
    if (input.trim() !== "") {
      if (/^\d*$/.test(input.trim())) {
        setFields((preFields) =>
          preFields.map((f) =>
            f.name === name ? { ...f, text: `${input.trim()} người` } : f
          )
        );
      }
    }
  };

  const handleChangeTimeCook = (e, name) => {
    const input = e.target.value;
    if (input.trim() !== "") {
      if (/^\d*$/.test(input.trim())) {
        setFields((preFields) =>
          preFields.map((f) =>
            f.name === name ? { ...f, text: `${input.trim()} phút` } : f
          )
        );
      }
    }
  };
  const handleResetFile = () => {
    setImgSrc();
    document.getElementById("fileUpload").value = "";
    document.getElementById("file").value = "";
  };
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  useEffect(() => {
    if (!user?.id) return; // user chưa có → bỏ qua
    const fetchData = async () => {
      try {
        const res = await axiosClient.get(`/recipes/${id}?userId=${user.id}`);
        setData(res.data);
        console.log(res.data);
        setCategoryForm(res.data.recipe.category);
        setImgSrc(res.data.recipe.image);
        setTags(res.data.recipe.tags);
        setFields((pre) =>
          pre.map((p) => {
            if (p.name === "ration") {
              return {
                ...p,
                text: res.data.recipe.servings
                  ? res.data.recipe.servings.toString() + " người"
                  : "",
              };
            } else if (p.name === "timeCook") {
              return {
                ...p,
                text: res.data.recipe.cookTime
                  ? res.data.recipe.cookTime.toString() + " phút"
                  : "",
              };
            } else if (p.name === "recipeName") {
              return {
                ...p,
                text: res.data.recipe.name
                  ? res.data.recipe.name.toString()
                  : "",
              };
            } else if (p.name === "desc") {
              return {
                ...p,
                text: res.data.description
                  ? res.data.recipe.description.toString()
                  : "",
              };
            } else {
              return p;
            }
          })
        );
        const initValue = [
          {
            id: 1,
            text: "",
            max: 500,
            image: [],
            image_name: [],
            link: { text: "", url: "" },
            numberVisible: false,
          },
          {
            id: 2,
            text: "",
            max: 500,
            image: [],
            image_name: [],
            link: { text: "", url: "" },
            numberVisible: false,
          },
        ];
        const initValueIngredient = [
          {
            id: 1,
            text: "",
            type: "ingredient",
            max: 200,
            numberVisible: false,
            warning: false,
          },
          {
            id: 2,
            text: "",
            type: "ingredient",
            max: 200,
            numberVisible: false,
            warning: false,
          },
        ];
        setIngredients((pre) =>
          res.data.recipe.ingredients.length > 0
            ? [
                ...res.data.recipe.ingredients.map((ing) => ({
                  id: ing._id.toString(),
                  text: `${ing.quantity} ${ing.unit} ${ing.name}`,
                  type: "ingredient",
                  max: 200,
                  numberVisible: false,
                  warning: false,
                })),
              ]
            : [...initValueIngredient]
        );
        setSteps((pre) =>
          res.data.recipe.steps.length > 0
            ? [
                ...res.data.recipe.steps.map((step) => ({
                  id: step._id.toString(),
                  text: step.instruction,
                  max: 500,
                  image: [...step.images],
                  image_name: [...step.images],
                  link: { text: step.referenceText, url: step.reference },
                })),
              ]
            : [...initValue]
        );
      } catch (error) {
        toast(error.response.data.message);
      }
    };

    fetchData();
  }, [user]);
  const [focus, setFocus] = useState(false);
  return (
    <>
      {(warning.name || warning.ingredient || warning.step) && !draft && (
        <div className="w-full rounded-[6px] bg-[#fe463a] p-[8px] flex items-center sticky top-[64px] z-10">
          <p className="m-auto text-white text-center">
            {warning.name && warning.name}
            {warning.step && warning.name && ","}
            {warning.step && warning.step}
            {warning.ingredient && warning.step && " và"}
            {warning.ingredient && warning.ingredient}
          </p>
          <Link>
            <img
              src="/close.svg"
              alt=""
              className=""
              onClick={() =>
                setWarning((pre) => ({
                  name: "",
                  ingredient: "",
                  step: "",
                }))
              }
            />
          </Link>
        </div>
      )}
      <div className="mx-auto flex-1">
        <Modal open={isOpen}>
          <div className="w-[672px] max-h-[600px] overflow-hidden scrollbar-hide absolute top-[50px] left-[50%] translate-x-[-50%]  bg-white border-none outline-none p-[16px] rounded-[8px] text-[#606060]">
            <div className="mb-[8px] flex items-center">
              <h4 className="text-center flex-1 text-[#4A4A4A] font-semibold">
                Thêm nguồn tham khảo
              </h4>
              <img
                src="/close.svg"
                alt=""
                className="cursor-pointer"
                onClick={() => setIsOpen(false)}
              />
            </div>
            <div className="flex items-center justify-between mb-[8px]">
              <form action="" className="flex items-center gap-[10px] flex-1">
                <div className="flex text-[1.6rem] bg-[#f8f6f2] h-[48px] items-center px-[8px] rounded w-full">
                  <img src="/search.svg" alt="" className="mr-[8px]" />
                  <input
                    type="text"
                    placeholder="Tìm nguồn tham khảo"
                    name="query"
                    className="border-none outline-none caret-[#f93] w-full bg-transparent placeholder:text-[1.4rem]"
                  />
                </div>
                <Button
                  text={"Tìm kiếm"}
                  px={"16px"}
                  py={"8px"}
                  color={"#f93"}
                  textColor={"#fff"}
                />
              </form>
            </div>

            <ul className="flex items-center text-[1.4rem] font-semibold text-[#4a4a4afc] mb-[5px]">
              <li className="relative">
                <Link
                  className={`block p-[16px] hover:opacity-60 ${
                    underline === "secret" &&
                    "before:content-[''] before:absolute before:w-full before:h-[2px] before:bg-[#f93] before:bottom-0 before:left-0"
                  }`}
                  onClick={() => setUnderline("secret")}
                >
                  Bí quyết
                </Link>
              </li>
              <li className="relative">
                <Link
                  className={`flex items-center p-[16px] ${
                    underline === "recipe" &&
                    "before:content-[''] before:absolute before:w-full before:h-[2px] before:bg-[#f93] before:bottom-0 before:left-0"
                  }`}
                  onClick={() => setUnderline("recipe")}
                >
                  <span className="hover:opacity-60"> Món</span>
                </Link>
              </li>
            </ul>
            <div className="flex flex-col gap-[5px] h-[400px] overflow-y-auto scrollbar-hide">
              {secretRecipe.map((r, i) => {
                return (
                  <>
                    <SecretRecipe
                      text={"Cách loại bỏ độc tố trong măng trước khi nấu"}
                      avatar={
                        "https://img-global.cpcdn.com/users/af3869a553276076/40x40cq50/avatar.webp"
                      }
                      name={"Annie Vo"}
                      src={
                        "https://img-global.cpcdn.com/tip_sections/ad7b9a60be5e49ec/128x128cq50/photo.webp"
                      }
                      onClick={handleLinkInput}
                      fuc={setSteps}
                      recipeId={id}
                      handleModal={setIsOpen}
                    />
                    {i + 1 === secretRecipe.length && (
                      <div className="w-full flex items-center justify-center">
                        {" "}
                        <Button text={"Xem thêm"} px={"16px"} py={"8px"} />
                      </div>
                    )}
                  </>
                );
              })}
            </div>
          </div>
        </Modal>
        <div className="max-w-[1146px] px-[16px] mx-auto">
          <div className="flex gap-[24px] mb-[40px] h-[411px]">
            <div className="w-[300px] min-h-full">
              {imgSrc && (
                <div className="p-[16px] bg-[#f8f5f1] flex items-center justify-center h-full text-[#606060] cursor-pointer relative">
                  <ImagePreview
                    src={imgSrc}
                    onDelete={() => {
                      handleResetFile();
                    }}
                    setImageState={setImageState}
                    handlePreview={handlePreview}
                    onReset={() => setFileKey(Date.now())}
                  />
                </div>
              )}

              <label htmlFor="fileUpload">
                <div
                  className={`p-[16px] bg-[#f8f5f1] flex items-center justify-center h-full cursor-pointer text-[#606060] ${
                    imgSrc && "hidden"
                  }`}
                >
                  <div>
                    <input
                      key={fileKey}
                      type="file"
                      name="image"
                      id="fileUpload"
                      className="hidden"
                      accept="image/*"
                      onChange={() => {
                        handlePreview();
                      }}
                    />
                    <img
                      src="https://global-web-assets.cpcdn.com/assets/camera-f90eec676af2f051ccca0255d3874273a419172412e3a6d2884f963f6ec5a2c3.png"
                      alt=""
                      className="w-[64px] h-[64px] mx-auto"
                    />
                    <p className="font-semibold text-center mt-[24px]">
                      Bạn đã đăng hình món mình nấu ở đây chưa?
                    </p>
                    <p className="px-[16px] text-[1.2rem] text-center">
                      Chia sẻ với mọi người thành phẩm nấu nướng của bạn nào!
                    </p>
                  </div>
                </div>
              </label>
            </div>
            <div className="flex-1">
              <>
                <div className="p-[8px] bg-[#f8f5f1] w-full h-[53.6px] relative">
                  <input
                    type="text"
                    name="name"
                    id=""
                    maxLength={100}
                    placeholder="Tên món: Mon canh bí ngon nhất nhà mình"
                    defaultValue={data?.recipe?.name && data.recipe.name}
                    onFocus={() => {
                      setFocus(true);
                      handleField("recipeName", "numberVisible", true);
                    }}
                    onBlur={() => {
                      setFocus(false);
                      handleField("recipeName", "numberVisible", false);
                    }}
                    onInput={(e) =>
                      handleField("recipeName", "text", e.target.value)
                    }
                    className={`outline-none bg-transparent h-full w-full absolute border top-0 left-0 px-[8px] text-[2.8rem] placeholder:text-[2.8rem] placeholder:text-[#CECECD] placeholder:font-semibold font-semibold ${
                      focus ? "border-[#f93]" : "border-[#f8f5f1]"
                    }`}
                  />
                </div>

                <div
                  className={`w-full h-[16px] flex items-center justify-end text-[1.2rem] text-gray-400 mt-[2px] ${
                    getField("recipeName").text.length >
                      getField("recipeName").max && "text-red-500"
                  }`}
                >
                  {getField("recipeName").numberVisible &&
                    getField("recipeName").text.length +
                      "/" +
                      getField("recipeName").max}
                </div>
              </>

              <div className="mb-[16px]">
                <Link className="flex items-center gap-[8px]">
                  <img
                    src={user?.avatar && user.avatar}
                    alt=""
                    className="w-[40px] h-[40px] rounded-[50%]"
                  />
                  <div>
                    <span className="text-[1.4rem] text-[#4A4A4A] font-semibold">
                      {user?.fullName && user.fullName}
                    </span>
                    <span> </span>
                    <span className="text-[#606060] text-[1.2rem]">
                      {user?.id_cookpad && user?.id_cookpad}
                    </span>
                    {user?.location && (
                      <div className="flex items-center gap-[4px]">
                        <img
                          src="/location.svg"
                          alt=""
                          className="w-[16px] h-[16px]"
                        />
                        <span className="text-[#606060] text-[1.2rem]">
                          {user?.location}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              </div>
              <div className="bg-[#f8f5f1] w-full">
                <TextareaAutosize
                  minRows={2}
                  maxRows={20}
                  maxLength={900}
                  onInput={(e) => handleField("desc", "text", e.target.value)}
                  onFocus={() => handleField("desc", "numberVisible", true)}
                  onBlur={() => handleField("desc", "numberVisible", false)}
                  placeholder="Hãy chia sẻ với mọi người về món này của bạn nhé - ai đã truyền cảm hứng cho bạn, tại sao nó đặc biệt, bạn thích thưởng thức nó thế nào?"
                  className="resize-none outline-none no-scrollbar w-full text-[#606060] bg-transparent border border-transparent p-[8px] placeholder:text-[#CECECD] focus:border-[#f93]"
                  name="description"
                  defaultValue={
                    data?.recipe?.description && data.recipe.description
                  }
                />
              </div>
              <TagInput tags={tags} setTags={setTags} />
              <CategorySelector
                value={categoryForm}
                onChange={setCategoryForm}
                required={true}
              />
              <div className="w-full h-[16px] flex items-center justify-end text-[1.2rem] text-gray-400 mt-[2px]">
                {getField("desc").numberVisible &&
                  getField("desc").text.length + "/" + getField("desc").max}
              </div>
            </div>
          </div>

          <div className="flex gap-[32px]">
            <div className="flex flex-col gap-[8px] pt-[8px] min-w-[300px] h-[680px] overflow-y-auto sticky top-[56px]">
              <h2 className="text-[2.4rem] text-[#4A4A4A] font-semibold">
                Nguyên liệu
              </h2>
              <div className="flex items-center justify-between w-full">
                <label
                  htmlFor=""
                  className="pb-[16px] text-[#606060] font-normal flex-shrink-0"
                >
                  Khẩu phần
                </label>
                <div>
                  <div className="bg-[#f8f5f1] w-[150px]">
                    <TextareaAutosize
                      minRows={1}
                      maxRows={5}
                      maxLength={50}
                      onInput={(e) => {
                        handleField("ration", "text", e.target.value);
                      }}
                      onFocus={() =>
                        handleField("ration", "numberVisible", true)
                      }
                      onBlur={(e) => {
                        handleField("ration", "numberVisible", false);
                        handleChangeRation(e, "ration");
                      }}
                      placeholder="2 người"
                      className="resize-none outline-none rounded-[4px] h-full w-full no-scrollbar text-[#606060] bg-transparent border border-transparent p-[8px] placeholder:text-[#CECECD] focus:border-[#f93]"
                      name="servings"
                      value={getField("ration").text}
                      defaultValue={
                        data?.recipe?.servings &&
                        data.recipe.servings + " người"
                      }
                    />
                  </div>
                  <div className="w-full h-[16px] flex items-center justify-end text-[1.2rem] text-gray-400 mt-[2px] bg-white">
                    {getField("ration").numberVisible &&
                      getField("ration").text.length +
                        "/" +
                        getField("ration").max}
                  </div>
                </div>
              </div>

              {ingredients.map((ing) => (
                <div className="flex items-center gap-[8px]" key={ing.id}>
                  <img
                    src="/movebar.svg"
                    alt=""
                    className="w-[24px] h-[24px] cursor-pointer mt-[-22px]"
                  />
                  <div className="bg-[#f8f5f1] w-[236px]">
                    <TextareaAutosize
                      minRows={1}
                      maxRows={10}
                      maxLength={200}
                      value={ing.text}
                      placeholder={
                        ing.type === "ingredient" ? "250g bột" : "Phần"
                      }
                      name={
                        ing.type === "ingredient" ? "ingredients" : "portion"
                      }
                      onFocus={() => {
                        handleInput(
                          setIngredients,
                          ing.id,
                          "numberVisible",
                          true
                        );
                        handleInput(setIngredients, ing.id, "warning", false);
                      }}
                      onBlur={() => {
                        ing.type === "ingredient" &&
                          handleInput(
                            setIngredients,
                            ing.id,
                            "numberVisible",
                            false
                          );
                        ing.type === "ingredient" &&
                          handleInput(setIngredients, ing.id, "warning", true);
                      }}
                      onInput={(e) => {
                        handleInput(
                          setIngredients,
                          ing.id,
                          "text",
                          e.target.value
                        );
                      }}
                      className="resize-none outline-none rounded-[4px] h-full w-full no-scrollbar text-[#606060] bg-transparent border border-transparent p-[8px] placeholder:text-[#CECECD] focus:border-[#f93]"
                    />
                    <div
                      className={`w-full h-[16px] flex items-center justify-end gap-[4px] text-[1.2rem] text-gray-400 mt-[2px] bg-white ${
                        ing.text.length > ing.max && "text-red-500"
                      }`}
                    >
                      {!/\d+\s*(g|ml|kg|l|muỗng|thìa|trái|củ|miếng|chén|tép|quả)/i.test(
                        ing.text
                      ) &&
                        ing.warning &&
                        ing.text !== "" && (
                          <>
                            <img src="/warning.svg" alt="" />
                            <span className="text-[#f89d14]">
                              Chưa có số lượng
                            </span>
                          </>
                        )}
                      {ing.warning &&
                        ing.text !== "" &&
                        !hasContext(ing.text) && (
                          <>
                            <img src="/warning.svg" alt="" />
                            <span className="text-[#f89d14]">
                              Chưa có nguyên liệu
                            </span>
                          </>
                        )}

                      {ing.numberVisible && ing.text.length + "/" + ing.max}
                    </div>
                  </div>
                  <Tippy
                    zIndex={1}
                    popperOptions={{
                      strategy: "fixed",
                    }}
                    placement="bottom-end"
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
                              {ing.type === "ingredient" ? (
                                <>
                                  <li
                                    className="p-[8px] text-center border-b"
                                    onClick={() =>
                                      handleDeleteIngredient(ing.id)
                                    }
                                  >
                                    <Link>
                                      <span>Xóa nguyên liệu</span>
                                    </Link>
                                  </li>
                                </>
                              ) : (
                                <li
                                  className="p-[8px] text-center border-b"
                                  onClick={() => handleDeleteIngredient(ing.id)}
                                >
                                  <Link>
                                    <span>Xóa phần này</span>
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
                      className="mt-[-22px] cursor-pointer"
                    />
                  </Tippy>
                </div>
              ))}

              <div className="flex items-center justify-center gap-[16px]">
                <Button
                  text={"Nguyên liệu"}
                  icon={<img src="/plus.svg" />}
                  px={"8px"}
                  py={"8px"}
                  borderColor={"#fff"}
                  textColor={"#4A4A4A"}
                  bold
                  onClick={() => handleAddIngredient("ingredient")}
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex flex-col gap-[8px] pt-[8px] min-w-[300px] sticky top-0">
                <h2 className="text-[2.4rem] text-[#4A4A4A] font-semibold">
                  Các bước
                </h2>
                <div className="flex items-center justify-between w-[300px]">
                  <label
                    htmlFor=""
                    className="pb-[16px] text-[#606060] font-normal flex-shrink-0"
                  >
                    Thời gian nấu
                  </label>
                  <div>
                    <div className="bg-[#f8f5f1] w-[150px]">
                      <TextareaAutosize
                        minRows={1}
                        maxRows={5}
                        maxLength={50}
                        onInput={(e) =>
                          handleField("timeCook", "text", e.target.value)
                        }
                        onFocus={() =>
                          handleField("timeCook", "numberVisible", true)
                        }
                        onBlur={(e) => {
                          handleField("timeCook", "numberVisible", false);
                          handleChangeTimeCook(e, "timeCook");
                        }}
                        placeholder="1 tiếng 30 phút"
                        className="resize-none outline-none rounded-[4px] h-full w-full no-scrollbar text-[#606060] bg-transparent border border-transparent p-[8px] placeholder:text-[#CECECD] focus:border-[#f93]"
                        name="cookTime"
                        value={getField("timeCook").text}
                      />
                    </div>
                    <div className="w-full h-[16px] flex items-center justify-end text-[1.2rem] text-gray-400 mt-[2px] bg-white">
                      {getField("timeCook").numberVisible &&
                        getField("timeCook").text.length +
                          "/" +
                          getField("timeCook").max}
                    </div>
                  </div>
                </div>
                <ul className="mt-[16px] w-full">
                  {steps.map((step, index) => (
                    <li className="flex mb-[16px]" key={step.id}>
                      <div className="mr-[15px]">
                        <div className="flex items-center gap-[5px] mt-[5px]">
                          <div className="w-[24px] h-[24px] rounded-[50%] bg-[#4a4a4a] text-white flex items-center justify-center text-[1.4rem] flex-shrink-0">
                            {index + 1}
                          </div>
                          <img
                            src="/movebar.svg"
                            alt=""
                            className="w-[24px] h-[24px] cursor-pointer"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-[8px] w-full">
                        <div className="bg-[#f8f5f1] w-full">
                          <TextareaAutosize
                            minRows={1}
                            maxRows={10}
                            maxLength={500}
                            defaultValue={step.text}
                            placeholder={`${
                              index === 1
                                ? "Đậy kín hỗn hợp lại và để ở nhiệt độ trong vòng 24 - 36 tiếng"
                                : "Trộn bột và nước đến khi đặc lại"
                            }`}
                            onFocus={() =>
                              handleInput(
                                setSteps,
                                step.id,
                                "numberVisible",
                                true
                              )
                            }
                            onBlur={() =>
                              handleInput(
                                setSteps,
                                step.id,
                                "numberVisible",
                                false
                              )
                            }
                            onInput={(e) =>
                              handleInput(
                                setSteps,
                                step.id,
                                "text",
                                e.target.value
                              )
                            }
                            className="resize-none outline-none rounded-[4px] h-full w-full no-scrollbar text-[#606060] bg-transparent border border-transparent p-[8px] placeholder:text-[#CECECD] focus:border-[#f93]"
                          />
                          <div
                            className={`w-full h-[16px] flex items-center justify-end gap-[4px] text-[1.2rem] text-gray-400 mt-[2px] bg-white ${
                              step.text.length > step.max && "text-red-500"
                            }`}
                          >
                            {/* <img src="/warning.svg" alt="" />
                  <span className="text-[#f89d14]">Chưa có số lượng</span> */}
                            {step.numberVisible &&
                              step.text.length + "/" + step.max}
                          </div>
                        </div>

                        <div className="w-full overflow-hidden">
                          <div className="flex gap-[8px] w-full px-[16px] mx-[-16px] flex-shrink-0 flex-wrap z-50">
                            {step.image.length > 0 &&
                              step.image.map((s, i) => (
                                <div className="w-[160px] h-[128px] flex-shrink-0 overflow-hidden bg-[#f8f5f1] z-50 cursor-pointer relative rounded-[5px]">
                                  <Image
                                    key={i}
                                    src={s}
                                    preview
                                    className="block w-full h-full"
                                    imageClassName="w-full h-full object-cover"
                                  />
                                  <div className="absolute flex items-center cursor-pointer px-[8px] py-[4px] bg-black/60 rounded-[5px] bottom-[5px] right-[5px]">
                                    <label>
                                      <input
                                        type="file"
                                        className="hidden"
                                        onChange={(e) =>
                                          handleUpdatePreviewStepImage(
                                            e,
                                            step.id,
                                            i,
                                            i
                                          )
                                        }
                                        multiple
                                      />
                                      <img
                                        src="/pen.svg"
                                        alt=""
                                        className="pr-[8px] mr-[8px] border-r"
                                      />
                                    </label>

                                    <img
                                      src="/bin2.svg"
                                      alt=""
                                      onClick={() =>
                                        handleDeletePreviewStepImage(
                                          step.id,
                                          i,
                                          i
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                              ))}
                            {step.image.length < 3 && (
                              <label htmlFor={`image_step${step.id}`}>
                                <div className="w-[160px] h-[128px] flex-shrink-0 overflow-hidden bg-[#f8f5f1] cursor-pointer relative rounded-[5px]">
                                  <input
                                    type="file"
                                    id={`image_step${step.id}`}
                                    className="hidden"
                                    onChange={(e) =>
                                      handlePreviewStepImage(e, step.id)
                                    }
                                    multiple
                                  />
                                  <img
                                    src="/camera.svg"
                                    alt=""
                                    className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
                                  />
                                </div>
                              </label>
                            )}
                          </div>
                        </div>
                        {step.link.url && (
                          <div className="flex items-center gap-[4px]">
                            <img src="/attachment.svg" alt="" />
                            <Link
                              target="blank"
                              to={step.link.src}
                              className="text-[#41aeff] text-[1.2rem] underline"
                            >
                              {step.link.text}
                            </Link>
                          </div>
                        )}
                      </div>
                      <div>
                        <Tippy
                          zIndex={1}
                          popperOptions={{
                            strategy: "fixed",
                          }}
                          placement="bottom-end"
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
                                    <>
                                      <li
                                        className="p-[8px] text-center border-b"
                                        onClick={() => handleAddStep2(index)}
                                      >
                                        <Link>
                                          <span>Thêm bước làm</span>
                                        </Link>
                                      </li>
                                      <li
                                        className="p-[8px] text-center border-b"
                                        onClick={() =>
                                          handleDeleteStep(step.id)
                                        }
                                      >
                                        <Link>
                                          <span>Xóa bước này</span>
                                        </Link>
                                      </li>

                                      {!step.link.url ? (
                                        <li
                                          className="p-[8px] text-center border-b"
                                          onClick={() => {
                                            setIsOpen(true);
                                            setId(step.id);
                                          }}
                                        >
                                          <Link>
                                            <span>Thêm nguồn dẫn</span>
                                          </Link>
                                        </li>
                                      ) : (
                                        <li
                                          className="p-[8px] text-center border-b"
                                          onClick={() => {
                                            handleDeleteLink(step.id);
                                          }}
                                        >
                                          <Link>
                                            <span>Xóa nguồn dẫn</span>
                                          </Link>
                                        </li>
                                      )}
                                    </>
                                  </ul>
                                </div>
                              </>
                            );
                          }}
                        >
                          <img
                            src="/threedot.svg"
                            alt=""
                            className="mt-[10px] cursor-pointer ml-[10px]"
                          />
                        </Tippy>
                      </div>
                    </li>
                  ))}
                </ul>
                <Button
                  text={"Bước làm"}
                  icon={<img src="/plus.svg" />}
                  px={"8px"}
                  py={"8px"}
                  borderColor={"#fff"}
                  textColor={"#4A4A4A"}
                  bold
                  onClick={handleAddStep}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UpdateRecipe;
