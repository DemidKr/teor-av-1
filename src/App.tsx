import React, {useEffect, useState} from 'react';
import {
    Box, Button,
    FormControl, FormHelperText,
    FormLabel,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    TextField,
    Typography
} from "@mui/material";
import Wrapper from "./components/Wrapper";

interface INumResult {
    remainder: number,
    numArr: number[]
}

const numResult = () => {
    return (
        <div>

        </div>
    );
};

function App() {
    const [sizeError, setSizeError] = useState<boolean>(false)
    const [alphabetError, setAlphabetError] = useState<boolean>(false)
    const [wordError, setWordError] = useState<boolean>(false)

    const [size, setSize] = useState<number>(0)
    const [alphabetInp, setAlphabetInp] = useState<string>('')
    const [alphabet, setAlphabet] = useState<string[]>([])
    const [byNum, setByNum] = useState<number>(0)
    const [byWord, setByWord] = useState<string>('')

    const [numResult, setNumResult] = useState<INumResult[]>([])
    const [finalNumResult, setFinalNumResult] = useState<string>('')
    const [wordNumResult, setWordNumResult] = useState<string>('')

    const [wordResult, setWordResult] = useState<string>('')
    const [finalWordResult, setFinalWordResult] = useState<number>(0)

    const [isSizeDisabled, setIsSizeDisabled] = useState<boolean>(false)
    const [showAlp, setShowAlp] = useState<boolean>(false)
    const [showOptions, setShowOptions] = useState<boolean>(false)

    const sizeInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const enteredNum: number = parseInt(event.target.value);
        if (enteredNum <= 0 || isNaN(enteredNum)) {
            setSizeError(true)
        } else {
            setSizeError(false)
        }
        setSize(enteredNum);
    };

    const alpInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const enteredApl = event.target.value

        const chars = enteredApl.split('')
        let uniqueChars = chars.filter((element, index) => {
            return chars.indexOf(element) === index;
        });

        if (enteredApl.length > size || chars.length !== uniqueChars.length) {
            setAlphabetError(true)
        } else {
            setAlphabetError(false)
        }

        setAlphabetInp(enteredApl)
        setAlphabet(uniqueChars)
    }

    const byNumInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const enteredNum: number = parseInt(event.target.value)
        setByNum(enteredNum)
    }

    const byWordInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const enteredWord: string = event.target.value
        let chars: string[] = enteredWord.split('')

        chars = chars.filter((element, index) => {
            return chars.indexOf(element) === index;
        });

        for (let i = 0; i < chars.length; i++) {
            if (alphabet.includes(chars[i])) {
                setWordError(false)
            } else {
                setWordError(true)
                break
            }
        }


        setByWord(enteredWord)
    }

    const showAlpInput = () => {
        if (size <= 0 || NaN) {
            setSizeError(true)
        } else {
            setIsSizeDisabled(true)
            setShowAlp(true)
        }
    }

    const cancelAlpInput = () => {
        setIsSizeDisabled(false)
        setShowAlp(false)
        setAlphabet([])
        setAlphabetInp('')
    }

    const cancelOptionsInput = () => {
        setShowAlp(false)
        setAlphabet([])
        setAlphabetInp('')
    }

    const showOptionsInput = () => {
        if (alphabet.length === size) {
            setShowOptions(true)
        } else {
            setAlphabetError(true)
        }
    }

    const solveByNum = () => {
        setNumResult([])
        let rem: number = byNum
        const nums: number[] = []
        const res: INumResult[] = []
        while(rem >= size) {
            let num: number = rem % size
            if (num === 0) {
                num = size
            }
            nums.push(num)
            rem = (rem - num)/size
            const step = {
                remainder: rem,
                numArr: [...nums]
            } as INumResult

            res.push(step)
        }
        if (rem !== 0) {
            nums.push(rem)
            const step = {
                remainder: 0,
                numArr: nums
            } as INumResult
            res.push(step)
        }
        setNumResult([...res])

        let finalStr: string = res[res.length-1].numArr[0].toString() + ' * 3^0'
        for(let i = 1; i < res[res.length-1].numArr.length; i++) {
            finalStr = res[res.length-1].numArr[i].toString() + ' * 3^' + i.toString() + ' + ' + finalStr
        }
        finalStr = '= ' + finalStr + ' ='

        let finalWord: string = alphabet[res[res.length-1].numArr[0] - 1]
        for(let i = 1; i < res[res.length-1].numArr.length; i++) {
            finalWord = finalWord + alphabet[res[res.length-1].numArr[i] - 1]
        }

        setWordNumResult(finalWord)
        setFinalNumResult(finalStr)
        // remove result of prev method
        setFinalWordResult(0)
    }

    const convertResultToStr = (item: INumResult): string => {
        let finalStr: string = ''
        if (item.remainder !== 0) {
            finalStr = item.remainder.toString() + ' * 3 + ' + item.numArr[item.numArr.length-1].toString()
        } else {
            finalStr = item.numArr[0].toString() + ' * 3'
        }

        if (item.numArr.length >= 2) {
            for (let i = item.numArr.length - 2; i >= 0; i-=1) {
                finalStr = '(' + finalStr + ') * 3 + ' + item.numArr[i].toString()
            }
        }

        return '= ' + finalStr + ' ='
    }

    const solveByWord = () => {
        let inputWord: string[] = byWord.split('')
        let result: number = 0
        let strResult: string = ''
        for (let i = 0; i < inputWord.length; i++) {
            for (let j = 0; j < alphabet.length; j++) {
                if (inputWord[i] === alphabet[j]) {
                    result += (j + 1) * Math.pow(size, inputWord.length - 1 - i)
                    strResult = strResult + ' + ' + (j + 1).toString() + ' * 3^' + (inputWord.length - 1 - i).toString()
                }
            }
        }

        strResult = '= ' + strResult.substring(2) + ' ='

        setWordResult(strResult)
        setFinalWordResult(result)
        // remove result of prev method
        setNumResult([])
    }

    return (
        <Box
            component="form"
            sx={{
                '& .MuiTextField-root': { m: 1, width: '25ch' },
                width: '100%',
                maxWidth: '100%',
            }}

            autoComplete="off"
        >
            <Wrapper>
                <Typography component="h1" variant="h4">
                    Теория автоматов
                </Typography>
            </Wrapper>
            <Wrapper>
                <FormControl sx={{ m: 1, width: '50ch' }} >
                    <InputLabel htmlFor="outlined-adornment-amount">Размер алфавита</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-amount"
                        disabled={isSizeDisabled}
                        // defaultValue={0}
                        error={sizeError}
                        type='number'
                        label="Размер алфавита"
                        placeholder={size.toString()}
                        onChange={sizeInputHandler}
                    />
                    {sizeError ?
                        <FormHelperText id="outlined-weight-helper-text" sx={{color: 'red'}}>
                            Размер алфавита не должен быть отрицательным или равным нулю
                        </FormHelperText>
                        : null
                    }
                    <Button
                        sx={{
                            mt: 2
                        }}
                        variant="contained"
                        disabled={sizeError || isSizeDisabled}
                        onClick={showAlpInput}
                        color="success"
                    >
                        Подтвердить
                    </Button>
                    {isSizeDisabled ?
                        <Button
                            sx={{
                                mt: 2
                            }}
                            variant="contained"
                            disabled={showOptions}
                            color="error"
                            onClick={cancelAlpInput}
                        >
                            Отменить
                        </Button>
                        : null
                    }
                </FormControl>
            </Wrapper>
            {showAlp ? <div>
                    <Wrapper>
                        <Typography component="h6" variant="h5">
                            Введите алфавит без пробелов
                        </Typography>
                    </Wrapper>
                    <Wrapper>

                        <FormControl sx={{ m: 1, width: '50ch' }} >
                            <InputLabel htmlFor="outlined-adornment-amount">Алфавит</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-amount"
                                // defaultValue={0}
                                disabled={showOptions}
                                label="Алфавит"
                                error={alphabetError}
                                type='text'
                                placeholder={alphabetInp}
                                onChange={alpInputHandler}
                            />
                            {alphabetError ?
                                <FormHelperText id="outlined-weight-helper-text" sx={{color: 'red'}}>
                                    Алфавит не должен содержать одиннаковых символов и должен быть правильного размера
                                </FormHelperText>
                                : null
                            }
                            <Button
                                sx={{
                                    mt: 2
                                }}
                                variant="contained"
                                disabled={alphabetError || showOptions}
                                color="success"
                                onClick={showOptionsInput}
                            >
                                Подтвердить
                            </Button>
                            {showOptions ?
                                <Button
                                    sx={{
                                        mt: 2
                                    }}
                                    variant="contained"
                                    // disabled={!isSizeDisabled}
                                    color="error"
                                    onClick={cancelOptionsInput}
                                >
                                    Отменить
                                </Button>
                                : null
                            }
                        </FormControl>
                    </Wrapper>
                </div>
                : null
            }
            {showOptions ?
                    <Wrapper>
                        <FormControl sx={{ m: 1, width: '50ch' }} >
                            <InputLabel htmlFor="outlined-adornment-amount">1 вариант: по числу</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-amount"
                                // defaultValue={0}
                                // disabled={showOptions}
                                label="1 вариант: по числу"
                                // error={alphabetError}
                                type='text'
                                placeholder={byNum.toString()}
                                onChange={byNumInputHandler}
                            />
                            {/*{alphabetError ?*/}
                            {/*    <FormHelperText id="outlined-weight-helper-text" sx={{color: 'red'}}>*/}
                            {/*        Алфавит не должен содержать одиннаковых символов или превышать введенный ранее размер*/}
                            {/*    </FormHelperText>*/}
                            {/*    : null*/}
                            {/*}*/}
                            <Button
                                sx={{
                                    mt: 2
                                }}
                                variant="contained"
                                // disabled={alphabetError || showOptions}
                                color="success"
                                onClick={solveByNum}
                            >
                                Вычислить
                            </Button>
                        </FormControl>
                        <FormControl sx={{ m: 1, width: '50ch' }} >
                            <InputLabel htmlFor="outlined-adornment-amount">2 вариант: по слову</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-amount"
                                // defaultValue={0}
                                // disabled={showOptions}
                                label="2 вариант: по слову"
                                error={wordError}
                                type='text'
                                placeholder={byWord}
                                onChange={byWordInputHandler}
                            />
                            {wordError ?
                                <FormHelperText id="outlined-weight-helper-text" sx={{color: 'red'}}>
                                    Введенное слово должно содержать только символы из алфавита
                                </FormHelperText>
                                : null
                            }
                            <Button
                                sx={{
                                    mt: 2
                                }}
                                variant="contained"
                                disabled={wordError}
                                color="success"
                                onClick={solveByWord}
                            >
                                Вычислить
                            </Button>
                        </FormControl>
                    </Wrapper>
                : null
            }
            {numResult.length !== 0 ? <div>
                <Wrapper>
                    {byNum}
                </Wrapper>
                {numResult.map((item, index) =>
                    <Wrapper>
                        {convertResultToStr(item)}
                    </Wrapper>
                )}
                <Wrapper>
                    {finalNumResult}
                </Wrapper>
                <Wrapper>
                    {wordNumResult.split("").reverse().join("")}
                </Wrapper>
            </div> : null}
            {finalWordResult !== 0 ? <div>
                <Wrapper>
                    {byWord}
                </Wrapper>
                <Wrapper>
                    {wordResult}
                </Wrapper>
                <Wrapper>
                    {finalWordResult}
                </Wrapper>
            </div> : null}

        </Box>
    )
}

export default App;
