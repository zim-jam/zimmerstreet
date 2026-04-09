import {
  Avatar,
  ListBox,
  SearchField,
  Separator,
  Tooltip,
} from "@heroui/react";
import { useNavigate, useLocation } from "@tanstack/react-router";

import {
  House,
  Picture,
  FileText,
  CircleInfo,
  Code,
  FileRuble,
} from "@gravity-ui/icons";

const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", id: "/", Icon: House },
    { label: "News", id: "/news", Icon: FileRuble },
    { label: "Algorithm Used", id: "/algorithm", Icon: Code },
    { label: "Poster", id: "/poster", Icon: Picture },
    { label: "Report", id: "/report", Icon: FileText },
    { label: "About", id: "/about", Icon: CircleInfo },
  ];

  const activeKey = location.pathname === "/" ? "/" : location.pathname;

  return (
    <div className="flex w-64">
      <aside className="sticky top-0 self-start h-screen flex flex-col gap-6 p-4 w-full overflow-y-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black">ZS</h1>

          <Tooltip delay={0}>
            <Tooltip.Trigger
              aria-label="User profile"
              className="cursor-pointer"
            >
              <Avatar>
                <Avatar.Image
                  alt="ZimJAM"
                  src="/src/assets/images/avatar.jpeg"
                />
                <Avatar.Fallback>Zim JAM</Avatar.Fallback>
              </Avatar>
            </Tooltip.Trigger>

            <Tooltip.Content showArrow className="outline">
              <Tooltip.Arrow />
              <div className="flex flex-col gap-0 py-1">
                <p className="font-semibold text-sm">ZimJAM</p>
                <p className="text-xs text-muted">zimjam@zimmerstreet.ml</p>
              </div>
            </Tooltip.Content>
          </Tooltip>
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
          disallowEmptySelection
          className="gap-0.5 flex flex-col"
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            if (selectedKey) {
              navigate({ to: selectedKey.toString() });
            }
          }}
        >
          {(item) => (
            <ListBox.Item
              key={item.id}
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
