import ServiceCard from "./ServiceCard";

function ServiceList({ services, selectedServiceId, onSelect }) {
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