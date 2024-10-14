import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function MainControls({ year }) {
  return (
    <>
      <Card className="flex flex-col justify-center align-middle items-center gap-2 p-4">
        <h2 className="text-3xl">{year}</h2>
        <Select>
          <SelectTrigger className="w-3/5">
            <SelectValue placeholder="Renewable type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Renewable type</SelectLabel>
              <SelectItem value="apple">solar</SelectItem>
              <SelectItem value="banana">onwind</SelectItem>
              <SelectItem value="blueberry">offwind-ac/dc</SelectItem>
              <SelectItem value="grapes">ror</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-3/5">
            <SelectValue placeholder="Parameters" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Parameters</SelectLabel>
              <SelectItem value="apple">CF</SelectItem>
              <SelectItem value="banana">curtailment</SelectItem>
              <SelectItem value="blueberry">used %</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className="flex flex-wrap gap-5 pt-3">
          <div className="flex flex-col justify-center align-middle items-center">
            <Avatar>
              <div className="bg-slate-200 w-full h-full"></div>
            </Avatar>
            <div>one</div>
          </div>
          <div className="flex flex-col justify-center align-middle items-center">
            <Avatar>
              <div className="bg-slate-400 w-full h-full"></div>
            </Avatar>
            <div>two</div>
          </div>
          <div className="flex flex-col justify-center align-middle items-center">
            <Avatar>
              <div className="bg-slate-600 w-full h-full"></div>
            </Avatar>
            <div>three</div>
          </div>
          <div className="flex flex-col justify-center align-middle items-center">
            <Avatar>
              <div className="bg-slate-800 w-full h-full"></div>
            </Avatar>
            <div>four</div>
          </div>
          <div className="flex flex-col justify-center align-middle items-center">
            <Avatar>
              <div className="bg-black w-full h-full"></div>
            </Avatar>
            <div>five</div>
          </div>
        </div>
      </Card>
    </>
  );
}
