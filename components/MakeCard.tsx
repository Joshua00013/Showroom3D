"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Make = {
  id: number;
  make: string;
  logo_path: string;
};

export default function MakeCard() {
  const [makes, setMakes] = useState<Make[]>([]);

  useEffect(() => {
    fetchMakes();
  }, []);

  const fetchMakes = async () => {
    const { data, error } = await supabase
      .from("make")
      .select("*")
      .order("make");

    if (error) {
      console.error(error);
      return;
    }
    setMakes(data);
  };
  
  const getLogoUrl = (path: string) => {
    return supabase.storage
      .from("CarModels")
      .getPublicUrl(path).data.publicUrl;
  };

    return (
    <>
        {makes.map((make) => (
        <Link key={make.id} href={`/makes/${make.id}`}>
            <img
            src={getLogoUrl(make.logo_path)}
            alt={make.make}
            className="w-24 h-24 object-contain cursor-pointer"
            />
        </Link>
        ))}
    </>
    );
}