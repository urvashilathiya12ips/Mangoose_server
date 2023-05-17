const allFieldsRequired = (data, isNested = false) => {
    if(isNested) return null
    const cloneData = [...data]
    let validatorArray = []
    cloneData?.forEach(value => {
        validatorArray?.push(!value)
    });
    return validatorArray?.some(data => !!data)
}

module.exports = allFieldsRequired