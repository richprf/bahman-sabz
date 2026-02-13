"use client";

import { groupedPeople } from "@/Src/data/groupedPeople";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { Fragment, useState, useMemo } from "react";
import { Virtuoso } from "react-virtuoso";

export default function VirtuosoDropdown() {
  const [selected, setSelected] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const filteredGroups = useMemo(() => {
    return groupedPeople
      .map((group) => ({
        label: group.label,
        options: group.options.filter((item) =>
          item.name.toLowerCase().includes(search.toLowerCase()),
        ),
      }))
      .filter((group) => group.options.length > 0);
  }, [search]);

  const allItems = useMemo(
    () => filteredGroups.flatMap((g) => g.options),
    [filteredGroups],
  );
  const allSelected = selected.length === allItems.length;

  const handleSelectAll = () => {
    if (allSelected) setSelected([]);
    else setSelected([...allItems]);
  };

  return (
    <div className="flex h-screen items-start justify-center bg-slate-950 pt-24">
      <div className="w-80">
        <Listbox value={selected} onChange={setSelected} multiple>
          <ListboxButton className="relative w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-left text-sm text-slate-200 shadow-md transition hover:border-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <span className="block truncate">
              {selected.length === 0
                ? "Select people"
                : `${selected.length} selected`}
            </span>
            <ChevronDownIcon className="absolute right-3 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
          </ListboxButton>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-150"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <ListboxOptions className="mt-3 w-full rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl focus:outline-none">
              <div className="p-3 border-b border-slate-800">
                <input
                  type="text"
                  placeholder="Search people..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800">
                <span className="text-sm text-slate-300">Select All</span>
                <div
                  onClick={handleSelectAll}
                  className={clsx(
                    "flex h-5 w-5 cursor-pointer items-center justify-center rounded border",
                    allSelected
                      ? "bg-indigo-500 border-indigo-500"
                      : "border-slate-600",
                  )}
                >
                  {allSelected && <CheckIcon className="size-3 text-white" />}
                </div>
              </div>

              <div className="h-60">
                <Virtuoso
                  totalCount={filteredGroups.length}
                  itemContent={(groupIndex) => {
                    const group = filteredGroups[groupIndex];
                    return (
                      <div key={group.label} className="mb-2">
                        <div className="sticky top-0 bg-slate-900 px-3 py-1 font-semibold text-slate-200">
                          {group.label}
                        </div>

                        {group.options.map((person) => {
                          const isSelected = selected.some(
                            (s) => s.id === person.id,
                          );
                          return (
                            <ListboxOption
                              key={person.id}
                              value={person}
                              className={({ active }) =>
                                clsx(
                                  "flex cursor-pointer items-center gap-3 px-3 py-2 text-sm transition",
                                  active
                                    ? "bg-indigo-600 text-white"
                                    : "text-slate-300",
                                )
                              }
                            >
                              <div
                                className={clsx(
                                  "flex h-5 w-5 items-center justify-center rounded border",
                                  isSelected
                                    ? "bg-indigo-500 border-indigo-500"
                                    : "border-slate-600",
                                )}
                              >
                                {isSelected && (
                                  <CheckIcon className="size-3 text-white" />
                                )}
                              </div>
                              <span className="flex-1">{person.name}</span>
                            </ListboxOption>
                          );
                        })}
                      </div>
                    );
                  }}
                />
              </div>
            </ListboxOptions>
          </Transition>
        </Listbox>
      </div>
    </div>
  );
}
