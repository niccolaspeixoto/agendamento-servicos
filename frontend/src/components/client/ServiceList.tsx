import type { Service } from "../../types/service";
import ServiceCard from "./ServiceCard";

interface ServiceListProps {
  services: Service[];
  selectedServiceId: string | null;
  onSelect: (serviceId: string) => void;
}

function ServiceList({ services, selectedServiceId, onSelect }: ServiceListProps) {
  return (
    <div>
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          selected={service.id === selectedServiceId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

export default ServiceList;