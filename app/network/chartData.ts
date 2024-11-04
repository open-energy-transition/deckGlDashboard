import React from "react";

export function getBusChartsData(
  selectedCountry: string,
  ref: React.MutableRefObject<any>
) {
  fetch(`/api/buseschart/${selectedCountry}`)
    .then((response) => response.json())
    .then((data) => {
      ref.current = data;
    });
}

export function getCountryCapacityChartsData(
  selectedCountry: string,
  ref: React.MutableRefObject<any>
) {
  fetch(`/api/countrycapacity/${selectedCountry}`)
    .then((response) => response.json())
    .then((data) => {
      ref.current = data;
    });
}

export function getCountryGenerationChartsData(
  selectedCountry: string,
  ref: React.MutableRefObject<any>
) {
  fetch(`/api/countrychart/${selectedCountry}`)
    .then((response) => response.json())
    .then((data) => {
      ref.current = data;
    });
}

export function getCountryDemandChartsData(
  selectedCountry: string,
  ref: React.MutableRefObject<any>
) {
  fetch(`/api/countrychartdemand/${selectedCountry}`)
    .then((response) => response.json())
    .then((data) => {
      ref.current = data;
    });
}

export function getCountryGenerationMixChartsData(
  selectedCountry: string,
  ref: React.MutableRefObject<any>
) {
  fetch(`/api/generation_mix/${selectedCountry}`)
    .then((response) => response.json())
    .then((data) => {
      ref.current = data;
    });
}

export function getBusGenerationChartsData(
  selectedCountry: string,
  ref: React.MutableRefObject<any>
) {
  fetch(`/api/generationbuschart/${selectedCountry}`)
    .then((response) => response.json())
    .then((data) => {
      ref.current = data;
    });
}

export function getInstalledCapacitiesChartsData(
  selectedCountry: string,
  ref: React.MutableRefObject<any>
) {
  fetch(`/api/installed_capacities/${selectedCountry}`)
    .then((response) => response.json())
    .then((data) => {
      ref.current = data;
    });
}

export function getTotalDemandChartsData(
  selectedCountry: string,
  ref: React.MutableRefObject<any>
) {
  fetch(`/api/total_demand/${selectedCountry}`)
    .then((response) => response.json())
    .then((data) => {
      ref.current = data;
    });
}
