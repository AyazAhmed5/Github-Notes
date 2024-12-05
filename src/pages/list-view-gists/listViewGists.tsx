import JohnDoe from "../../assets/images/john-doe.png";
import ForkIcon from "../../assets/images/forkIcon.svg";
import StarIcon from "../../assets/images/star-icon.svg";

const ListViewGists = () => {
  return (
    <div>
      <table className="w-full border-collapse text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-4 table-headings">Name</th>
            <th className="p-4 table-headings">Notebook Name</th>
            <th className="p-4 table-headings">Keyword</th>
            <th className="p-4 table-headings">Updated</th>
            <th className="p-4 table-headings"></th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b hover:bg-gray-50">
            <td className="p-4 flex items-center gap-2">
              <img
                src={JohnDoe}
                alt="John Doe"
                className="w-10 h-10 rounded-full"
              />
              <span className="table-data">John Doe</span>
            </td>
            <td className="p-4 table-data">Notebook Name</td>
            <td className="p-4">
              <span className="px-5 py-1 bg-[#003B44] text-[11px] font-bold text-white rounded-full table-heading">
                Keyword
              </span>
            </td>
            <td className="p-4 table-data">Last updated a few hours ago</td>
            <td className="p-4 flex items-center justify-end">
              <button className="p-2 hover:bg-gray-200 rounded-full">
                <img
                  src={ForkIcon}
                  className="fork-star-icon"
                  alt="fork-icon "
                />
              </button>
              <button className="p-2 hover:bg-gray-200 rounded-full">
                <img
                  src={StarIcon}
                  className="fork-star-icon"
                  alt="fork-icon "
                />
              </button>
            </td>
          </tr>
        </tbody>
        <tfoot className="bg-gray-100">
          <tr>
            <th className="p-4 table-headings"></th>
            <th className="p-4 table-headings"></th>
            <th className="p-4 table-headings"></th>
            <th className="p-4 table-headings"></th>
            <th className="p-4"></th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default ListViewGists;
