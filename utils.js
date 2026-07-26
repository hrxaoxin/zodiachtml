/**
 * ZODIAC_UTILS - 十二生肖工具函数
 * 提供 NFT 信息解析、星级显示、地址格式化等通用工具
 */
window.ZODIAC_UTILS = (function() {
    const config = window.ZODIAC_CONFIG || {};
    const ZODIAC_NAMES = config.ZODIAC_NAMES || ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
    const ATTR_NAMES = config.ATTR_NAMES || { water: '水', wind: '风', fire: '火', dark: '暗', light: '光' };
    const ATTR_PREFIXES = config.ATTR_PREFIXES || { water: 'shui', wind: 'feng', fire: 'huo', dark: 'an', light: 'guang' };
    const IPFS_BASES = config.IPFS_BASES || {};
    const ANIMAL_KEYS = ['shu', 'niu', 'hu', 'tu', 'long', 'she', 'ma', 'yang', 'hou', 'ji', 'gou', 'zhu'];
    const ATTR_KEYS = ['water', 'wind', 'fire', 'dark', 'light'];
    const GENDER_NAMES = ['母', '公'];

    /**
     * 根据 typeId 获取 NFT 信息
     * typeId 编码: elementIndex * 24 + zodiacIndex * 2 + gender
     */
    function getNFTInfo(typeId, tokenId, growth) {
        let typedId = parseInt(typeId, 10);
        if (isNaN(typedId)) {
            typedId = 0;
        }
        if (typedId < 0 || typedId > 119) {
            typedId = ((typedId % 120) + 120) % 120;
        }

        const elementIndex = Math.floor(typedId / 24);
        const remainder = typedId % 24;
        const zodiacIndex = Math.floor(remainder / 2);
        const gender = remainder % 2;

        const elementKey = ATTR_KEYS[elementIndex] || 'water';
        const attrName = ATTR_NAMES[elementKey] || '未知';
        const animalName = ZODIAC_NAMES[zodiacIndex] || '未知';
        const genderName = GENDER_NAMES[gender] || '?';
        const isRare = (elementKey === 'dark' || elementKey === 'light');

        const prefix = ATTR_PREFIXES[elementKey] || elementKey;
        const animalKey = ANIMAL_KEYS[zodiacIndex] || 'shu';
        const imagePath = `images/fu-cards/${prefix}${animalKey}_${gender}.jpg`;

        let name = `${attrName}${animalName}`;

        return {
            typeId: typedId,
            elementIndex,
            zodiac: zodiacIndex,
            gender,
            elementKey,
            attrName,
            animalName,
            genderName,
            imagePath,
            name: name,
            isRare,
            prefix: prefix
        };
    }

    /** 获取星级字符串 */
    function getStars(level) {
        if (level === null || level === undefined) return '';
        const lv = parseInt(level, 10);
        if (isNaN(lv) || !isFinite(lv) || lv <= 0) return '';
        return '⭐'.repeat(Math.min(Math.max(lv, 0), 5));
    }

    /**
     * 获取本地技能数据（回退方案）
     * @param typeId NFT类型ID
     * @return { type, damage, cooldown, isAoe }
     */
    function getLocalSkill(typeId) {
        const typedId = parseInt(typeId, 10);
        if (isNaN(typedId) || typedId < 0 || typedId > 119) {
            return { type: 0, damage: 100, cooldown: 3, isAoe: false };
        }

        const elementIndex = Math.floor(typedId / 24);
        const remainder = typedId % 24;
        const zodiacIndex = Math.floor(remainder / 2);
        const gender = remainder % 2;

        const getSkillType = function(z, g) {
            if (z == 0 && g == 0) return 0;
            if (z == 0 && g == 1) return 6;
            if (z == 1 && g == 0) return 0;
            if (z == 1 && g == 1) return 8;
            if (z == 2 && g == 0) return 0;
            if (z == 2 && g == 1) return 5;
            if (z == 3 && g == 0) return 0;
            if (z == 3 && g == 1) return 2;
            if (z == 4 && g == 0) return 3;
            if (z == 4 && g == 1) return 8;
            if (z == 5 && g == 0) return 7;
            if (z == 5 && g == 1) return 6;
            if (z == 6 && g == 0) return 1;
            if (z == 6 && g == 1) return 4;
            if (z == 7 && g == 0) return 3;
            if (z == 7 && g == 1) return 5;
            if (z == 8 && g == 0) return 1;
            if (z == 8 && g == 1) return 7;
            if (z == 9 && g == 0) return 2;
            if (z == 9 && g == 1) return 4;
            if (z == 10 && g == 0) return 3;
            if (z == 10 && g == 1) return 5;
            if (z == 11 && g == 0) return 1;
            if (z == 11 && g == 1) return 8;
            return 6;
        };

        const skillData = {
            0: {
                0: { 0: { d: 125, cd: 3, aoe: false }, 1: { d: 110, cd: 4, aoe: false } },
                1: { 0: { d: 145, cd: 5, aoe: false }, 1: { d: 95, cd: 4, aoe: true } },
                2: { 0: { d: 165, cd: 5, aoe: false }, 1: { d: 85, cd: 4, aoe: true } },
                3: { 0: { d: 130, cd: 3, aoe: false }, 1: { d: 80, cd: 3, aoe: false } },
                4: { 0: { d: 185, cd: 5, aoe: true }, 1: { d: 100, cd: 4, aoe: true } },
                5: { 0: { d: 115, cd: 4, aoe: false }, 1: { d: 125, cd: 4, aoe: false } },
                6: { 0: { d: 125, cd: 3, aoe: false }, 1: { d: 110, cd: 4, aoe: false } },
                7: { 0: { d: 145, cd: 5, aoe: false }, 1: { d: 115, cd: 4, aoe: true } },
                8: { 0: { d: 165, cd: 5, aoe: false }, 1: { d: 85, cd: 4, aoe: true } },
                9: { 0: { d: 130, cd: 3, aoe: false }, 1: { d: 80, cd: 3, aoe: false } },
                10: { 0: { d: 185, cd: 5, aoe: true }, 1: { d: 100, cd: 4, aoe: true } },
                11: { 0: { d: 140, cd: 5, aoe: false }, 1: { d: 150, cd: 4, aoe: true } }
            },
            1: {
                0: { 0: { d: 135, cd: 3, aoe: false }, 1: { d: 115, cd: 4, aoe: false } },
                1: { 0: { d: 130, cd: 5, aoe: false }, 1: { d: 105, cd: 4, aoe: true } },
                2: { 0: { d: 155, cd: 5, aoe: false }, 1: { d: 90, cd: 4, aoe: true } },
                3: { 0: { d: 140, cd: 3, aoe: false }, 1: { d: 100, cd: 3, aoe: false } },
                4: { 0: { d: 180, cd: 5, aoe: true }, 1: { d: 95, cd: 4, aoe: true } },
                5: { 0: { d: 125, cd: 4, aoe: false }, 1: { d: 120, cd: 4, aoe: false } },
                6: { 0: { d: 135, cd: 3, aoe: false }, 1: { d: 115, cd: 4, aoe: false } },
                7: { 0: { d: 150, cd: 5, aoe: false }, 1: { d: 125, cd: 4, aoe: true } },
                8: { 0: { d: 155, cd: 5, aoe: false }, 1: { d: 90, cd: 4, aoe: true } },
                9: { 0: { d: 140, cd: 3, aoe: false }, 1: { d: 100, cd: 3, aoe: false } },
                10: { 0: { d: 180, cd: 5, aoe: true }, 1: { d: 95, cd: 4, aoe: true } },
                11: { 0: { d: 145, cd: 5, aoe: false }, 1: { d: 140, cd: 4, aoe: true } }
            },
            2: {
                0: { 0: { d: 120, cd: 3, aoe: false }, 1: { d: 105, cd: 4, aoe: false } },
                1: { 0: { d: 140, cd: 5, aoe: false }, 1: { d: 110, cd: 4, aoe: true } },
                2: { 0: { d: 160, cd: 5, aoe: false }, 1: { d: 85, cd: 4, aoe: true } },
                3: { 0: { d: 145, cd: 3, aoe: false }, 1: { d: 95, cd: 3, aoe: false } },
                4: { 0: { d: 170, cd: 5, aoe: true }, 1: { d: 95, cd: 4, aoe: true } },
                5: { 0: { d: 120, cd: 4, aoe: false }, 1: { d: 115, cd: 4, aoe: false } },
                6: { 0: { d: 120, cd: 3, aoe: false }, 1: { d: 105, cd: 4, aoe: false } },
                7: { 0: { d: 145, cd: 5, aoe: false }, 1: { d: 130, cd: 4, aoe: true } },
                8: { 0: { d: 160, cd: 5, aoe: false }, 1: { d: 85, cd: 4, aoe: true } },
                9: { 0: { d: 145, cd: 3, aoe: false }, 1: { d: 95, cd: 3, aoe: false } },
                10: { 0: { d: 170, cd: 5, aoe: true }, 1: { d: 95, cd: 4, aoe: true } },
                11: { 0: { d: 140, cd: 5, aoe: false }, 1: { d: 135, cd: 4, aoe: true } }
            },
            3: {
                0: { 0: { d: 145, cd: 3, aoe: false }, 1: { d: 135, cd: 4, aoe: false } },
                1: { 0: { d: 150, cd: 5, aoe: false }, 1: { d: 115, cd: 4, aoe: true } },
                2: { 0: { d: 165, cd: 5, aoe: false }, 1: { d: 90, cd: 4, aoe: true } },
                3: { 0: { d: 160, cd: 3, aoe: false }, 1: { d: 100, cd: 3, aoe: false } },
                4: { 0: { d: 220, cd: 5, aoe: true }, 1: { d: 125, cd: 4, aoe: true } },
                5: { 0: { d: 145, cd: 4, aoe: false }, 1: { d: 130, cd: 4, aoe: false } },
                6: { 0: { d: 145, cd: 3, aoe: false }, 1: { d: 135, cd: 4, aoe: false } },
                7: { 0: { d: 160, cd: 5, aoe: false }, 1: { d: 135, cd: 4, aoe: true } },
                8: { 0: { d: 165, cd: 5, aoe: false }, 1: { d: 90, cd: 4, aoe: true } },
                9: { 0: { d: 160, cd: 3, aoe: false }, 1: { d: 100, cd: 3, aoe: false } },
                10: { 0: { d: 220, cd: 5, aoe: true }, 1: { d: 125, cd: 4, aoe: true } },
                11: { 0: { d: 155, cd: 5, aoe: false }, 1: { d: 150, cd: 4, aoe: true } }
            },
            4: {
                0: { 0: { d: 150, cd: 3, aoe: false }, 1: { d: 140, cd: 4, aoe: false } },
                1: { 0: { d: 155, cd: 5, aoe: false }, 1: { d: 110, cd: 4, aoe: true } },
                2: { 0: { d: 170, cd: 5, aoe: false }, 1: { d: 100, cd: 4, aoe: true } },
                3: { 0: { d: 165, cd: 3, aoe: false }, 1: { d: 105, cd: 3, aoe: false } },
                4: { 0: { d: 230, cd: 5, aoe: true }, 1: { d: 120, cd: 4, aoe: true } },
                5: { 0: { d: 150, cd: 4, aoe: false }, 1: { d: 135, cd: 4, aoe: false } },
                6: { 0: { d: 150, cd: 3, aoe: false }, 1: { d: 140, cd: 4, aoe: false } },
                7: { 0: { d: 165, cd: 5, aoe: false }, 1: { d: 130, cd: 4, aoe: true } },
                8: { 0: { d: 170, cd: 5, aoe: false }, 1: { d: 100, cd: 4, aoe: true } },
                9: { 0: { d: 165, cd: 3, aoe: false }, 1: { d: 105, cd: 3, aoe: false } },
                10: { 0: { d: 230, cd: 5, aoe: true }, 1: { d: 120, cd: 4, aoe: true } },
                11: { 0: { d: 160, cd: 5, aoe: false }, 1: { d: 155, cd: 4, aoe: true } }
            }
        };

        const data = skillData[elementIndex] && skillData[elementIndex][zodiacIndex] && skillData[elementIndex][zodiacIndex][gender];
        if (data) {
            return { id: typeId, type: getSkillType(zodiacIndex, gender), damage: data.d, cooldown: data.cd, duration: 0, isAoe: data.aoe };
        }
        return { id: typeId, type: 0, damage: 100, cooldown: 3, duration: 0, isAoe: false };
    }

    /**
     * 输入验证工具
     */
    const Validation = {
        isPositiveInteger(value) {
            const num = parseInt(value, 10);
            return !isNaN(num) && isFinite(num) && num > 0 && num === Math.floor(num);
        },

        isNonNegativeInteger(value) {
            const num = parseInt(value, 10);
            return !isNaN(num) && isFinite(num) && num >= 0 && num === Math.floor(num);
        },

        isPositiveNumber(value) {
            const num = parseFloat(value);
            return !isNaN(num) && isFinite(num) && num > 0;
        },

        isValidAddress(address) {
            if (!address) return false;
            return /^0x[a-fA-F0-9]{40}$/.test(address);
        },

        isValidAmount(value, min = 0, max = null) {
            const num = parseFloat(value);
            if (isNaN(num) || !isFinite(num) || num < min) return false;
            if (max !== null && num > max) return false;
            return true;
        },

        isValidTokenId(tokenId) {
            const id = parseInt(tokenId, 10);
            return !isNaN(id) && isFinite(id) && id > 0;
        },

        validateMintCount(count) {
            const num = parseInt(count, 10);
            if (isNaN(num) || !isFinite(num)) return { valid: false, message: '数量必须是数字' };
            if (num < 1) return { valid: false, message: '数量必须大于0' };
            if (num > 10) return { valid: false, message: '单次铸造数量不能超过10' };
            return { valid: true, message: '' };
        },

        validateStakeAmount(amount) {
            const num = parseFloat(amount);
            if (isNaN(num) || !isFinite(num)) return { valid: false, message: '金额必须是数字' };
            if (num <= 0) return { valid: false, message: '金额必须大于0' };
            return { valid: true, message: '' };
        },

        validateTeamSize(tokenIds) {
            if (!Array.isArray(tokenIds)) return { valid: false, message: '战队必须是数组' };
            if (tokenIds.length !== 6) return { valid: false, message: '战队必须包含6个NFT' };
            const uniqueIds = [...new Set(tokenIds)];
            if (uniqueIds.length !== 6) return { valid: false, message: '战队中不能有重复的NFT' };
            for (const id of tokenIds) {
                if (!this.isValidTokenId(id)) return { valid: false, message: `无效的NFT ID: ${id}` };
            }
            return { valid: true, message: '' };
        }
    };

    /** 格式化地址显示 */
    function formatAddress(address) {
        if (!address) return '0x...';
        if (address.length <= 10) return address;
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    }

    /** 获取生肖名称 */
    function getZodiacName(index) {
        return ZODIAC_NAMES[index] || '未知';
    }

    /** 获取属性名称 */
    function getAttrName(elementKey) {
        return ATTR_NAMES[elementKey] || '未知';
    }

    /** 判断 NFT 是否稀有 */
    function isRareToken(elementKey) {
        return elementKey === 'dark' || elementKey === 'light';
    }

    /** 获取属性索引 */
    function getAttrIndex(elementKey) {
        return ATTR_KEYS.indexOf(elementKey);
    }

    /** 获取 NFT 图片路径 */
    function getNFTImagePath(typeId) {
        const info = getNFTInfo(typeId);
        return info.imagePath;
    }

    /** 截断文本 */
    function truncateText(text, maxLength) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    /** 转换为可读数字 */
    function formatNumber(num, decimals) {
        if (num === undefined || num === null) return '0';
        const n = parseFloat(num);
        if (isNaN(n)) return '0';
        return n.toFixed(decimals || 2);
    }

    /** 获取元素对应的颜色 */
    function getElementColor(elementKey) {
        const colors = {
            water: '#0ea5e9',
            wind: '#22c55e',
            fire: '#ef4444',
            dark: '#8b5cf6',
            light: '#f59e0b'
        };
        return colors[elementKey] || '#6b7280';
    }

    /** 获取元素对应的 CSS 类名 */
    function getElementCardClass(elementKey) {
        return `${elementKey}-card`;
    }

    function getTypeNameCN(attrType) {
        const types = ['攻击型', '防御型', '生命型', '平衡型', '速度型'];
        return types[attrType] || '未知类型';
    }

    function getZodiacBonusName(zodiac) {
        const bonuses = [
            '速度+攻击',
            '防御+生命',
            '攻击+速度',
            '速度+生命',
            '攻击+生命',
            '速度+攻击',
            '速度+攻击',
            '生命+防御',
            '攻击+速度',
            '攻击+防御',
            '防御+生命',
            '生命+防御'
        ];
        return bonuses[zodiac] || '未知';
    }

    function getSkillTypeName(skillType) {
        const types = [
            '普攻强化',
            '连击攻击',
            '快速打击',
            '范围爆发',
            '治疗恢复',
            '持续伤害',
            '力量增幅',
            '防御削弱',
            '群体攻击',
            '瘟疫突袭'
        ];
        return types[skillType] || '特殊技能';
    }

    function getSkillDescription(skillType, damage, isAoe) {
        const descriptions = [
            `对单个敌人造成${damage}%攻击力的伤害`,
            `连续攻击敌人2次，每次造成${Math.floor(damage/2)}%攻击力的伤害`,
            `快速攻击敌人，造成${damage}%攻击力的伤害，冷却时间较短`,
            `释放范围技能，对范围内所有敌人造成${damage}%攻击力的伤害`,
            `恢复自身${damage}%最大生命值`,
            `使敌人中毒，持续${Math.floor(damage/10)}回合，每回合造成${Math.floor(damage/5)}%攻击力的伤害`,
            `提升自身攻击力${damage}%，持续3回合`,
            `降低敌人防御力${damage}%，持续3回合`,
            `对所有敌人造成${damage}%攻击力的伤害`,
            `释放瘟疫，对所有敌人造成${damage}%攻击力的伤害，并使其中毒`
        ];
        return descriptions[skillType] || '未知技能效果';
    }

    return {
        getNFTInfo,
        getStars,
        getLocalSkill,
        formatAddress,
        getZodiacName,
        getAttrName,
        isRareToken,
        getAttrIndex,
        getNFTImagePath,
        truncateText,
        formatNumber,
        getElementColor,
        getElementCardClass,
        getTypeNameCN,
        getZodiacBonusName,
        getSkillTypeName,
        getSkillDescription,
        Validation,
        ZODIAC_NAMES,
        ATTR_NAMES,
        ATTR_PREFIXES,
        ATTR_KEYS,
        ANIMAL_KEYS,
        GENDER_NAMES
    };
})();
