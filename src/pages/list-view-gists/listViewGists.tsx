import ForkIcon from "../../assets/images/forkIcon.svg";
import StarIcon from "../../assets/images/star-icon.svg";

import { useSelector } from "react-redux";
import { RootState } from "../../store/root-reducer";
import { formatTimeAgo } from "../../utilities/utils";

const ListViewGists = () => {
  const { gists } = useSelector((state: RootState) => state.gists);

  return (
    <div>
      <table className="w-full border-collapse text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 table-headings">Name</th>
            <th className="p-3 table-headings">Notebook Name</th>
            <th className="p-3 table-headings">Keyword</th>
            <th className="p-3 table-headings">Updated</th>
            <th className="p-3 table-headings"></th>
          </tr>
        </thead>
        <tbody>
          {gists.map((gist) => (
            <tr
              key={gist.id}
              className="border-b hover:bg-gray-50 cursor-pointer border-l border-r"
            >
              <td className="p-3 flex items-center gap-2">
                <img
                  src={gist.owner.avatar_url}
                  alt="John Doe"
                  className="w-10 h-10 rounded-full"
                />
                <span className="table-data">{gist.owner.login}</span>
              </td>
              <td className="p-3 table-data">Notebook Name</td>
              <td className="p-3">
                <span className="px-5 py-1 bg-[#003B44] text-[11px] font-bold text-white rounded-full table-heading">
                  Keyword
                </span>
              </td>
              <td className="p-3 table-data">
                {formatTimeAgo(gist.updated_at)}
              </td>
              <td className="p-3 flex items-center justify-end">
                <button className="p-3 hover:bg-gray-200 rounded-full">
                  <img
                    src={ForkIcon}
                    className="fork-star-icon"
                    alt="fork-icon "
                  />
                </button>
                <button className="p-3 hover:bg-gray-200 rounded-full">
                  <img
                    src={StarIcon}
                    className="fork-star-icon"
                    alt="fork-icon "
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListViewGists;
