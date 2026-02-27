import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

export default function CategoryGroupDropdown({
  groupId,
  setGroupId,
  categoryId,
  setCategoryId,
}) {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    axiosClient
      .get("/api/category-groups")
      .then((res) => {
        console.log(res.data);
        setGroups(res.data.groups || []);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="space-y-2">
      <div>
        <label className="block text-sm font-medium">Chọn nhóm món</label>
        <select
          className="w-full border p-2 rounded"
          value={groupId || ""}
          onChange={(e) => {
            setGroupId(e.target.value);
            setCategoryId("");
          }}
        >
          <option value="">Tất cả nhóm</option>
          {groups.map((g) => (
            <option key={g._id} value={g._id}>
              {g.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Chọn danh mục</label>
        <select
          className="w-full border p-2 rounded"
          value={categoryId || ""}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">Tất cả danh mục</option>
          {groups
            .find((g) => g._id === groupId)
            ?.categories?.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
}
