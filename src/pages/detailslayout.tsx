/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { PageLayout } from "./pagelayout";
import { GoBackLink } from "@/components/custom/gobacklink";

interface FieldConfig<T> {
  label: string;
  value: keyof T | ((entity: T) => string | number);
}

interface GenericDetailsPageProps<T> {
  entityName: string;
  service: {
    getEntity: (id: number) => Promise<{ status: number; data?: T }>;
  };
  fields: FieldConfig<T>[];
}

export function GenericDetailsPage<T>({ entityName, service, fields }: GenericDetailsPageProps<T>) {
  const { id } = useParams<{ id: string }>();
  const [entity, setEntity] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();
  const navigate = useNavigate();

  const getAndSetEntity = async (id: number) => {
    setLoading(true);

    const res = await service.getEntity(id);
    if (res.status === 200 && res.data) setEntity(res.data);
    else if (res.status === 404) navigate("/404");
    else {
      toast({
        title: "Something went wrong.",
        description: `Couldn't get the ${entityName}.`,
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    if (id) {
      getAndSetEntity(parseInt(id));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto mt-8">
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <PageLayout>
        <GoBackLink />
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
            <CardTitle>{`${entity && entityName} Details`}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              {
                entity ?
                  (<div className="grid grid-cols-2 gap-4">
                      {fields.map(({ label, value }, index) => {
                        const fieldValue =
                            typeof value === "function" ? value(entity) : entity[value];

                        return (
                            <div key={index} className="space-y-2">
                              <Label>{label}</Label>
                              <div className="text-sm font-medium">{fieldValue as React.ReactNode}</div>
                            </div>
                        );
                      })}
                  </div>) : <div className="text-center mt-8">{`${entityName} not found`}</div>
              }
            </CardContent>
        </Card>
    </PageLayout>
  );
}