import { FiSun, FiMoon, FiCloud } from "react-icons/fi";
import { WiDaySunnyOvercast, WiDayCloudy } from "react-icons/wi";
import { IconType } from "react-icons";

export type TimeOfDay = 'morning' | 'afternoon' | 'night' | 'cloudy';

/**
 * Determina o período do dia com base na hora atual
 * @returns Período do dia (morning, afternoon, night, cloudy)
 */
export function getCurrentTimeOfDay(): TimeOfDay {
  const currentHour = new Date().getHours();
  
  // Dias de semana são "nublados" (para fins de demonstração - segunda-feira)
  const isMonday = new Date().getDay() === 1;
  if (isMonday) return 'cloudy';
  
  if (currentHour >= 5 && currentHour < 12) {
    return 'morning';
  } else if (currentHour >= 12 && currentHour < 18) {
    return 'afternoon';
  } else {
    return 'night';
  }
}

/**
 * Obtém o ícone correspondente ao período do dia
 * @param timeOfDay Período do dia
 * @returns Componente de ícone
 */
export function getTimeOfDayIcon(timeOfDay: TimeOfDay): IconType {
  switch (timeOfDay) {
    case 'morning':
      return FiSun;
    case 'afternoon':
      return WiDaySunnyOvercast;
    case 'night':
      return FiMoon;
    case 'cloudy':
      return FiCloud;
    default:
      return FiSun;
  }
}

/**
 * Obtém a cor correspondente ao período do dia
 * @param timeOfDay Período do dia
 * @returns Código de cor (hex)
 */
export function getTimeOfDayColor(timeOfDay: TimeOfDay): string {
  switch (timeOfDay) {
    case 'morning':
      return '#f97316'; // Laranja (Sol da manhã)
    case 'afternoon':
      return '#eab308'; // Amarelo (Sol da tarde)
    case 'night':
      return '#6366f1'; // Índigo (Noite)
    case 'cloudy':
      return '#64748b'; // Cinza azulado (Nublado)
    default:
      return '#f97316';
  }
}

/**
 * Obtém a descrição do período do dia
 * @param timeOfDay Período do dia
 * @returns Descrição do período
 */
export function getTimeOfDayDescription(timeOfDay: TimeOfDay): string {
  switch (timeOfDay) {
    case 'morning':
      return 'Manhã';
    case 'afternoon':
      return 'Tarde';
    case 'night':
      return 'Noite';
    case 'cloudy':
      return 'Nublado';
    default:
      return 'Manhã';
  }
}