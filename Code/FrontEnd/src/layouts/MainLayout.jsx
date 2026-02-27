import Header from "../components/Header";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { userContext } from "../context/UserContext";
function MainLayout() {
  const { user, setUser } = useContext(userContext);
  const [recipes, setRecipes] = useState({
    all: [],
    saved: [],
    published: [],
    draft: [],
    authored: [],
    cooked: [],
  });
  const [inputValue, setInputValue] = useState("");
  const [primaryInput, setPrimaryInput] = useState("");
  const [inputValueNavbar, setInputValueNavbar] = useState("");
  const [dataRecipe, setDataRecipe] = useState([]);
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState(false);
  const [update, setUpdate] = useState(false);
  const [data, setData] = useState({});
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [tags, setTags] = useState([]);
  const [homeSearch, setHomeSearch] = useState(false);
  const [originalData, setOriginalData] = useState([]);
  const [dataSuggest, setDataSuggest] = useState([]);
  const [imageState, setImageState] = useState(false);
  const [recipeId, setRecipeId] = useState("");
  const [openLogin, setOpenLogin] = useState(false);
  const [categoryForm, setCategoryForm] = useState("");
  const [userLogin, setUserLogin] = useState({
    avatar: "",
    fullName: "",
    email: "",
    id: "",
    location: "",
  });

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
  const initValueField = [
    { name: "recipeName", text: "", max: 100, numberVisible: false },
    { name: "desc", text: "", max: 900, numberVisible: false },
    { name: "ration", text: "", max: 50, numberVisible: false },
    { name: "timeCook", text: "", max: 50, numberVisible: false },
  ];
  const [submitTrigger, setSubmitTrigger] = useState(false);
  const [fields, setFields] = useState(initValueField);
  const [steps, setSteps] = useState(initValue);
  const [warning, setWarning] = useState({
    name: "",
    ingredient: "",
    step: "",
  });
  const [ingredients, setIngredients] = useState(initValueIngredient);
  const handleOpenNavbar = () => {
    setIsOpen(true);
  };
  const handleCloseNavbar = () => {
    setIsOpen(false);
  };
  const extractNumber = (str) => {
    if (str === undefined || str === null) return null; // quan trọng
    str = String(str); // ép về chuỗi an toàn

    const match = str.match(/\d+/);
    return match ? Number(match[0]) : null;
  };

  const parseCookTime = (str) => {
    if (!str) return 0; // <-- THÊM DÒNG NÀY

    const regex = /(\d+(\.\d+)?)\s*(giờ|tiếng|h|phút|p|giây)/gi;

    return [...str.matchAll(regex)].reduce((total, match) => {
      const value = Number(match[1]);
      const unit = match[3].toLowerCase();

      if (["giờ", "tiếng", "h"].includes(unit)) return total + value * 60;
      if (["phút", "p"].includes(unit)) return total + value;
      if (unit === "giây") return total + value / 60;
      return total;
    }, 0);
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };
  const removeVietnameseTones = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase();
  };
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const obj = {};

    const image1 = formData.get("imagePrimary");
    const image2 = formData.get("image");
    let mainImageFile;
    if (image2 && image2.size > 0) {
      mainImageFile = image2;
    } else if (image1 && image1.size > 0) {
      mainImageFile = image1;
    } else {
      mainImageFile = image2;
    }
    if (mainImageFile instanceof File && mainImageFile.size > 0) {
      const base64String = await fileToBase64(mainImageFile);
      obj.image = base64String;
    } else if (data?.image && typeof data.image === "string") {
      obj.image = data.image;
    } else {
      if (!imageState) {
        obj.image = "";
      } else {
        obj.image =
          "https://global-web-assets.cpcdn.com/assets/blank4x3-59a0a9ef4e6c3432579cbbd393fb1f1f98d52b9b66a9aae284872b67434274b8.png";
      }
    }

    formData.delete("image");

    for (let [key, value] of formData.entries()) {
      if (["name", "cookTime", "servings", "description"].includes(key)) {
        obj[key] = value;
        continue;
      }

      if (obj[key]) {
        obj[key].push(value);
      } else {
        obj[key] = [value];
      }
    }

    obj.steps = steps.map((step, index) => ({
      stepNumber: index + 1,
      instruction: step.text,
      images: [...step.image],
      reference: step.link.url || "",
      referenceText: step.link.text || "",
    }));

    obj.ingredients = (obj.ingredients || []).map((str) => {
      if (typeof str !== "string") return str; // nếu đã là object thì bỏ qua

      str = str.trim(); // Lọc khoảng trắng

      // Regex mở rộng để phân tách số lượng, đơn vị và tên nguyên liệu
      const match = str.match(
        /^(\d+(?:\s+\d+\/\d+|\.\d+|\/\d+)?)\s*([^\d]+?)?\s+(.+)$/i
      );

      if (match) {
        let quantityStr = match[1].trim();
        let unit = (match[2] || "").trim();
        let name = match[3].trim();

        // ✅ Xử lý phân số
        const fractionMatch = quantityStr.match(/^(\d+)\s+(\d+)\/(\d+)$/); // VD: 1 1/2
        if (fractionMatch) {
          quantityStr =
            parseInt(fractionMatch[1]) + fractionMatch[2] / fractionMatch[3];
        } else if (quantityStr.includes("/")) {
          const [a, b] = quantityStr.split("/").map(Number);
          quantityStr = a / b;
        }

        // Nếu không có đơn vị, giả sử là "1" đơn vị (ví dụ: bơ, táo, quả cam, ...)

        // Trả về đối tượng ingredient đã phân tích
        return {
          name,
          quantity: parseFloat(quantityStr) || 1, // Nếu không có số lượng hợp lệ, mặc định là 1
          unit,
        };
      }

      // Trường hợp không khớp với bất kỳ mẫu nào, trả về mặc định rỗng
      return { name: str, quantity: 0, unit: "" };
    });

    const isEmptyIngredients = obj.ingredients.every((i) => !i.name && !i.unit);
    const isEmptySteps = obj.steps.every(
      (s) => !s.instruction && s.images.length === 0
    );

    let newWarning = { name: "", ingredient: "", step: "" };
    let hasError = false;

    if (isEmptyIngredients) {
      newWarning.ingredient = "Nguyên liệu không thể để trắng";
      hasError = true;
    }
    if (isEmptySteps) {
      newWarning.step = "Các bước không thể để trắng";
      hasError = true;
    }
    if (!obj.name) {
      newWarning.name = "Tiêu đề không thể để trắng";
      hasError = true;
    }

    if (!obj.name) obj.name = "Không đề";
    obj.ingredients = obj.ingredients.filter((i) => i.name);
    obj.steps = obj.steps.filter(
      (s) => s.instruction || s.images.length || s.reference
    );
    obj.cookTime = parseCookTime(obj.cookTime);
    obj.servings = extractNumber(obj.servings);
    obj.tags = tags;
    if (hasError) {
      setWarning((prev) => ({ ...prev, ...newWarning }));
      if (draft) {
        obj.status = "draft";
        setSubmitTrigger(true);
        setData(obj);
      }
      return;
    }
    obj.category = categoryForm;
    setSubmitTrigger(true);
    setData(obj);
  };

  const handleSubmitFormSearch = (e) => {
    e.preventDefault();
    if (!inputValueNavbar.trim()) {
      return;
    } else {
      setHomeSearch(true);
      setInputValue(inputValueNavbar);

      setData(
        originalData.filter((item) =>
          removeVietnameseTones(item.name).includes(
            removeVietnameseTones(inputValueNavbar)
          )
        )
      );
      navigate("/me/library");
    }
  };
  useEffect(() => {
    if (!submitTrigger) return;
    setLoading(true);
    const handleAddRecipe = async () => {
      try {
        let res;

        if (update) {
          res = await axiosClient.put(
            `/recipes/updateRecipe/${recipeId}`,
            data
          );
        } else if (draft) {
          res = await axiosClient.post("/recipes/addDraft", data);
        } else {
          res = await axiosClient.post("/recipes/add", data);
        }

        toast(res.data.message);
        navigate("/");
        setData({});
        setSteps(initValue);
        setIngredients(initValueIngredient);
        setFields(initValueField);
        setDraft(false);
        setTags([]);
        setWarning((pre) => ({
          name: "",
          ingredient: "",
          step: "",
        }));
      } catch (error) {
        if (location.pathname === "/recipe/add") {
          toast(error.response.data.message);
        }
      } finally {
        setSubmitTrigger(false); // reset trigger
        setLoading(false);
      }
    };
    handleAddRecipe();
  }, [submitTrigger]);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const res = await axiosClient.get("/recipes/user-recipes");
        const { saved, drafts, published, authored, cooked } = res.data.recipe;
        setRecipes({
          all: [...drafts, ...published, ...saved],
          saved,
          published,
          draft: drafts,
          authored,
          cooked,
        });
        setOriginalData([...drafts, ...published, ...saved]);
      } catch (error) {}
    };
    fetchData();
  }, [user]);
  return (
    <div className="px-[6px]">
      <div
        className={`${
          isOpen ? "grid grid-cols-12" : "flex"
        } gap-2 rounded-s-md`}
      >
        <Navbar
          isOpen={isOpen}
          openFunction={handleOpenNavbar}
          closeFunction={handleCloseNavbar}
          data={recipes}
          setData={setRecipes}
          inputValue={inputValueNavbar}
          setInputValue={setInputValueNavbar}
          handleSubmitFormSearch={handleSubmitFormSearch}
          setOpenLogin={setOpenLogin}
        />
        <div className={`${isOpen && "col-span-10"} bg-white w-full`}>
          <form action="" onSubmit={(e) => handleSubmitForm(e)}>
            <Header
              primaryInput={primaryInput}
              setPrimaryInput={setPrimaryInput}
              dataSuggest={dataSuggest}
              setDataSuggest={setDataSuggest}
              loading={loading}
              userLogin={userLogin}
              setUserLogin={setUserLogin}
              draft={draft}
              setDraft={setDraft}
              update={update}
              setUpdate={setUpdate}
              recipeId={recipeId}
              setRecipeId={setRecipeId}
              search={location.pathname === "/search"}
              navigation={
                location.pathname.startsWith("/recipes/") ||
                location.pathname === "/profile" ||
                location.pathname === "/editProfile" ||
                location.pathname === "/stactistical"
              }
              addRecipe={
                location.pathname === "/recipe/add" ||
                location.pathname.includes("/update")
              }
              updateRecipe={location.pathname.includes("/update")}
              openLogin={openLogin}
              setOpenLogin={setOpenLogin}
            />
            <Outlet
              context={{
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
                data: dataRecipe,
                setData: setDataRecipe,
                recipes,
                setRecipes,
                homeSearch,
                setHomeSearch,
                searchData: data,
                inputValue,
                setInputValue,
                originalData,
                setOriginalData,
                inputValueNavbar,
                primaryInput,
                setPrimaryInput,
                dataSuggest,
                setDataSuggest,
                imageState,
                setImageState,
                openLogin,
                setOpenLogin,
                categoryForm,
                setCategoryForm,
              }}
            />
            {location.pathname !== "/recipe/add" &&
              location.pathname !== "password" && <Footer />}
          </form>
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
