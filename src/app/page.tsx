'use client';
import Image from 'next/image'
import {useForm} from "react-hook-form";
import {useState} from "react";
import axios from "axios";

type FormData = {
    ipAddress: string,
}

type FormDataLed = {
    red: number,
    green: number,
    blue: number,
}

type FormDataMessage = {
    message: string,
}
export default function Home() {
    const {register: registerIp, handleSubmit: handleSubmitIp} = useForm<FormData>();
    const {
        register: registerMessage,
        handleSubmit: handleSubmitMessage} = useForm<FormDataMessage>();
    const {
        register: registerLed,
        handleSubmit: handleSubmitLed} = useForm<FormDataLed>();
    const [currentTemp, setCurrentTemp] = useState('0.0' as string)
    const [currentHumidity, setCurrentHumidity] = useState('0.0' as string)
    const [currentLight, setCurrentLight] = useState('0.0' as string)
    const [currentColor, setCurrentColor] = useState([0, 0, 0, 0] as number[])
    const [currentIp, setCurrentIp] = useState('' as string)
    const [isIpSet, setIsIpSet] = useState(false as boolean)

    let timerId = setInterval(getData, 15000);

    setTimeout(() => {
        clearInterval(timerId);
    }, 30000);

    function getData() {
        if (isIpSet) {
            getCurrentTemp().then(() => getCurrentHumidity())

            console.log("get data")
        }
    }

    const onSubmitIp = handleSubmitIp(async (data) => {
        console.log(data)
        setCurrentIp(data.ipAddress)
        setIsIpSet(true)
    })

    const onSubmitMessage = handleSubmitMessage(async (data) => {
        console.log(data)
        try {
            let options = {
                method: 'POST',
                url: `http://${currentIp}/matrix`,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                },
                data: {
                    message: data.message,
                }
            };
            const response = await axios.request(options).then((response) => response as any);
            console.log(response)
            if (response.status === 201) {
                alert("Mensaje mostrado en la matriz de LED")
            } else {
                alert("Error al enviar el mensaje")
            }
        } catch (error: any) {
            alert("Error al enviar el mensaje: " + error);
        }
    })

    const onsubmitLed = handleSubmitLed(async (data) => {
        console.log(data)
        try {
            let options = {
                method: 'POST',
                url: `http://${currentIp}/led`,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                },
                data: {
                    red: Number(data.red),
                    green: Number(data.green),
                    blue: Number(data.blue),
                }
            };
            const response = await axios.request(options).then((response) => response as any);
            console.log(response)
            if (response.status === 201) {
                let transparency = 1
                if(Number(data.red) == 0 && Number(data.green) == 0 && Number(data.blue) == 0){
                    transparency = 0
                }
                setCurrentColor([Number(data.red), Number(data.green), Number(data.blue), transparency])
            } else {
                alert("Error al cambiar el color")
            }
        } catch (error: any) {
            alert("Error al cambiar el color: " + error);
        }
    })

    const getCurrentTemp = async () => {
        try {
            let options = {
                method: 'GET',
                url: `http://${currentIp}/temperature`,
            };
            const response = await axios.request(options).then((response) => response as any);
            console.log(response)
            setCurrentTemp(response.data.value.toString())
        } catch (error: any) {
            alert("Error al obtener la temperatura: " + error);
        }
    }

    const getCurrentHumidity = async () => {
        try {
            let options = {
                method: 'GET',
                url: `http://${currentIp}/humidity`,
            };
            const response = await axios.request(options).then((response) => response as any);
            console.log(response)
            setCurrentHumidity(response.data.value.toString())
        } catch (error: any) {
            alert("Error al obtener la humedad: " + error);
        }
    }

    const getCurrentLight = async () => {
        try {
            let options = {
                method: 'GET',
                url: `http://${currentIp}/light`,
            };
            const response = await axios.request(options).then((response) => response as any);
            console.log(response)
            setCurrentLight(response.data.value.toString())
        } catch (error: any) {
            alert("Error al obtener la luz: " + error);
        }
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
                <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4">
                    Sistemas Embebidos con ESP32s, temperatura, LED RGB y Matriz de LED
                </p>
                <div
                    className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white lg:static lg:h-auto lg:w-auto lg:bg-none">
                    <a
                        className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
                        href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        By{' '}
                        <Image
                            src="/qstechgroup.svg"
                            alt="QS TechGroup Logo"
                            className=""
                            width={140}
                            height={34}
                            priority
                        />
                    </a>
                </div>
            </div>

            <div>
                <form onSubmit={onSubmitIp}>
                    <div className="relative z-0 w-full mb-6 group">
                        <input type="text" id="ipAddress" {...registerIp("ipAddress")}
                               className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                               placeholder=" " required/>
                        <label htmlFor="ipAddress"
                               className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                            Dirección IP
                        </label>
                        <button type="submit"
                                className="text-white bg-amber-700 hover:bg-amber-800 font-medium rounded-lg text-sm w-full px-5 py-2.5 my-2.5 text-center">Establecer
                        </button>
                    </div>
                </form>
            </div>

            <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
                <div className={"pt-4 pl-6 home__main-quickActionsContainer"}>
                    <div className={"home__main-quickActionsItem"}>
                        {isIpSet ?
                            <a
                                href="#"
                                onClick={(event) => {
                                    event.preventDefault()
                                    getCurrentTemp()
                                }}
                            >
                                <div className="home__main_quickActionsButton">
                                    <span className="text-lg font-bold">{currentTemp}°C</span>
                                    <Image
                                        src="/sun.svg"
                                        alt="sun"
                                        className=""
                                        width={25}
                                        height={25}
                                        priority
                                    /><span className="text-lg font-bold">Temperatura</span>
                                </div>
                            </a>
                            :
                            <a>
                                <div className="home__main_quickActionsButton">
                                    <span className="text-lg font-bold">{currentTemp}°C</span>
                                    <Image
                                        src="/sun.svg"
                                        alt="sun"
                                        className=""
                                        width={25}
                                        height={25}
                                        priority
                                    /><span className="text-lg font-bold">Temperatura</span>
                                </div>
                            </a>
                        }
                    </div>
                </div>
                <div className={"pt-4 pl-6 home__main-quickActionsContainer"}>
                    <div className={"home__main-quickActionsItem"}>
                        {isIpSet ?
                            <a
                                href="#"
                                onClick={(event) => {
                                    event.preventDefault()
                                    getCurrentHumidity()
                                }}
                            >
                                <div className="home__main_quickActionsButton">
                                    <span className="text-lg font-bold">{currentHumidity}%</span>
                                    <Image
                                        src="/water-drop.svg"
                                        alt="water drop"
                                        className=""
                                        width={25}
                                        height={25}
                                        priority
                                    /><span className="text-lg font-bold">Humedad</span>
                                </div>
                            </a>
                            :
                            <a>
                                <div className="home__main_quickActionsButton">
                                    <span className="text-lg font-bold">{currentHumidity}%</span>
                                    <Image
                                        src="/water-drop.svg"
                                        alt="water drop"
                                        className=""
                                        width={25}
                                        height={25}
                                        priority
                                    /><span className="text-lg font-bold">Humedad</span>
                                </div>
                            </a>
                        }
                    </div>
                </div>
                <div className={"pt-4 pl-6 home__main-quickActionsContainer"}>
                    <div className={"home__main-quickActionsItem"}>
                        {isIpSet ?
                            <a
                                href="#"
                                onClick={(event) => {
                                    event.preventDefault()
                                    getCurrentLight()
                                }}
                            >
                                <div className="home__main_quickActionsButton">
                                    <span className="text-lg font-bold">{currentLight} Lum</span>
                                    <span className="text-lg font-bold">Luz</span>
                                </div>
                            </a>
                            :
                            <a>
                                <div className="home__main_quickActionsButton">
                                    <span className="text-lg font-bold">{currentLight} Lum</span>
                                    <span className="text-lg font-bold">Luz</span>
                                </div>
                            </a>
                        }
                    </div>
                </div>
                <div className={"pt-4 pl-6 home__main-quickActionsContainer"}>
                    <div className={"home__main-quickActionsItem"}>
                        {isIpSet ?
                            <form onSubmit={onsubmitLed}>
                                <div className="home__main_quickActionsButton">
                                    <div className={"rounded-2xl px-3 mb-1"} style={{
                                        backgroundColor: `rgba(${currentColor[0]}, ${currentColor[1]}, ${currentColor[2]}, ${currentColor[3]})`,
                                    }}>
                                        <span className="text-sm font-bold">Color</span>
                                    </div>
                                    <div className="whitespace-nowrap">
                                        <label htmlFor="Rojo"
                                               className=" mb-1 mx-2 text-sm font-medium text-gray-900e">Rojo</label>
                                        <input type="number" id="Rojo"
                                               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-12 p-1"
                                               placeholder="255"
                                               {...registerLed("red")} required min={0} max={255} step={1}/>
                                    </div>
                                    <div className="whitespace-nowrap">
                                        <label htmlFor="Verde"
                                               className=" mb-1 mx-2 text-sm font-medium text-gray-900e">Verde</label>
                                        <input type="number" id="Verde"
                                               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-12 p-1"
                                               placeholder="255"
                                               {...registerLed("green")} required min={0} max={255} step={1}/>
                                    </div>
                                    <div className="whitespace-nowrap">
                                        <label htmlFor="Azul"
                                               className=" mb-1 mx-2 text-sm font-medium text-gray-900e">Azul</label>
                                        <input type="number" id="Azul"
                                               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-12 p-1"
                                               placeholder="255"
                                               {...registerLed("blue")} required min={0} max={255} step={1}/>
                                    </div>
                                    <button type="submit"
                                            className="text-white bg-amber-500 hover:bg-amber-600  font-medium rounded-lg text-sm w-full px-2 mt-2 sm:w-auto text-center">Cambiar
                                        color
                                    </button>
                                </div>

                            </form>
                            :
                            <div className="home__main_quickActionsButton">
                                La dirección IP no ha sido establecida.
                            </div>
                        }
                    </div>
                </div>
                <div className={"pt-4 pl-6 home__main-quickActionsContainer"}>
                    <div className={"home__main-quickActionsItem"}>
                        {isIpSet ?
                            <form onSubmit={onSubmitMessage}>
                                <div className="home__main_quickActionsButton">
                                    <div className={"rounded-2xl px-3 mb-1"}>
                                        <span className="text-sm font-bold">Establecer matriz LED 8x8</span>
                                    </div>
                                    <div className="">
                                        <label htmlFor="Mensaje"
                                               className=" mb-1 mx-2 text-sm font-medium text-gray-900">Mensaje</label>
                                        <input type="text" id="Mensaje"
                                               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-1 w-full"
                                               placeholder="Hola Mundo!"
                                               {...registerMessage("message")} required/>
                                    </div>
                                    <button type="submit"
                                            className="text-white bg-amber-500 hover:bg-amber-600  font-medium rounded-lg text-sm w-full px-2 mt-2 sm:w-auto text-center">
                                        Enviar mensaje
                                    </button>
                                </div>

                            </form>
                            :
                            <div className="home__main_quickActionsButton">
                                La dirección IP no ha sido establecida.
                            </div>
                        }
                    </div>
                </div>
            </div>

            <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
                <a
                    href="https://en.wikipedia.org/wiki/ESP32"
                    className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <h2 className={`mb-3 text-2xl font-semibold`}>
                        ESP32s{' '}
                        <span
                            className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
                    </h2>
                    <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
                        ESP32 is a series of low-cost, low-power system on a chip microcontrollers with integrated Wi-Fi and dual-mode Bluetooth
                    </p>
                </a>

                <a
                    href="https://www.ledsupply.com/blog/rgb-lighting-guide-to-the-top-5-rgb-led-strips-lights/#:~:text=An%20RGB%20LED%20is%20an,under%20a%20clear%20protective%20lens."
                    className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <h2 className={`mb-3 text-2xl font-semibold`}>
                        LED RGB{' '}
                        <span
                            className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
                    </h2>
                    <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
                        An RGB LED is an LED module that can produce almost any color using these three primary additive colors: Red, Green and Blue.
                    </p>
                </a>

                <a
                    href="https://programarfacil.com/blog/arduino-blog/matriz-led-arduino-max7219/#:~:text=Las%20matrices%20LEDs%208%C3%97,al%20display%20de%207%20segmentos."
                    className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <h2 className={`mb-3 text-2xl font-semibold`}>
                        Matriz LED{' '}
                        <span
                            className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
                    </h2>
                    <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
                        Su nombre se debe a que están compuestas por 64 LEDs dispuestos en forma de cuadrado con 8 columnas de 8 LEDs cada una.
                    </p>
                </a>

                <a
                    href="https://components101.com/sensors/dht11-temperature-sensor#:~:text=use%20DHT11%20Sensors-,The%20DHT11%20is%20a%20commonly%20used%20Temperature%20and%20humidity%20sensor,to%20interface%20with%20other%20microcontrollers."
                    className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <h2 className={`mb-3 text-2xl font-semibold`}>
                        DHT11{' '}
                        <span
                            className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
                    </h2>
                    <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
                        The DHT11 is a commonly used Temperature and humidity sensor.
                    </p>
                </a>
            </div>
        </main>
    )
}
