import { Avatar, ListBox, SearchField, Separator } from "@heroui/react";
import { useNavigate, useLocation } from "@tanstack/react-router";

import { House, Picture, FileText, CircleInfo, Code } from "@gravity-ui/icons";

const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", path: "/", Icon: House },
    { label: "Algorithm Used", path: "/algorithm", Icon: Code },
    { label: "Poster", path: "/poster", Icon: Picture },
    { label: "Report", path: "/report", Icon: FileText },
    { label: "About", path: "/about", Icon: CircleInfo },
  ];

  const activeKey = location.pathname === "/" ? "/" : location.pathname;

  return (
    <div className="flex h-screen w-64">
      <aside className="flex flex-col gap-6 p-4 w-full">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black">ZS</h1>
          <Avatar>
            <Avatar.Image alt="ZimJAM" src="/src/assets/images/avatar.jpeg" />
            <Avatar.Fallback>Zim JAM</Avatar.Fallback>
          </Avatar>
        </div>

        <SearchField name="search">
          <SearchField.Group>
            <SearchField.SearchIcon />
            <SearchField.Input placeholder="Search..." />
            <SearchField.ClearButton />
          </SearchField.Group>
        </SearchField>

        <ListBox
          items={navItems}
          aria-label="Sidebar navigation"
          selectionMode="single"
          selectedKeys={[activeKey]}
          className="gap-0.5 flex flex-col"
          onAction={(key) => navigate({ to: key.toString() })}
        >
          {(item) => (
            <ListBox.Item
              id={item.path}
              textValue={item.label}
              className="group p-2 cursor-pointer data-[selected=true]:bg-default text-sm font-medium flex items-center gap-3"
            >
              <div className="text-default-500 group-data-[selected=true]:text-foreground group-hover:text-foreground">
                <item.Icon className="w-5 h-5" aria-hidden="true" />
              </div>
              <span>{item.label}</span>
            </ListBox.Item>
          )}
        </ListBox>
      </aside>
      <Separator orientation="vertical" />
    </div>
  );
};

export default SideBar;
