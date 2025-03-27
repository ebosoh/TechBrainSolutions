import React from "react";

export default function StaticWavySeparator() {
  return (
    <div className="relative h-[70px] overflow-hidden">
      <div
        className="absolute left-0 right-0 bottom-0 h-[70px] bg-no-repeat bg-cover bg-center rotate-180"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z' opacity='0.1' fill='%2334b768'%3E%3C/path%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}