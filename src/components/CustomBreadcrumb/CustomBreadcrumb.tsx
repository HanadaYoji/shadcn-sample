// CustomBreadcrumb.tsx
import React from "react";
import {
  Breadcrumb as ShadcnBreadcrumb,
  BreadcrumbItem as ShadcnBreadcrumbItem,
  BreadcrumbLink as ShadcnBreadcrumbLink,
  BreadcrumbList as ShadcnBreadcrumbList,
  BreadcrumbPage as ShadcnBreadcrumbPage,
  BreadcrumbSeparator as ShadcnBreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CustomBreadcrumbProps } from "@/types/CustomBreadcrumb.types";

export const CustomBreadcrumb: React.FC<CustomBreadcrumbProps> = ({
  items,
}) => {
  return (
    <div className="p-4">
      <ShadcnBreadcrumb>
        <ShadcnBreadcrumbList>
          {items.map((item, index) => (
            <React.Fragment key={index}>
              <ShadcnBreadcrumbItem>
                {item.href ? (
                  <ShadcnBreadcrumbLink href={item.href}>
                    {item.label}
                  </ShadcnBreadcrumbLink>
                ) : (
                  <ShadcnBreadcrumbPage>{item.label}</ShadcnBreadcrumbPage>
                )}
              </ShadcnBreadcrumbItem>
              {index < items.length - 1 && <ShadcnBreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </ShadcnBreadcrumbList>
      </ShadcnBreadcrumb>
    </div>
  );
};
